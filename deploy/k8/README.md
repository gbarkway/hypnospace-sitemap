# Kubernetes Deployment Notes

I used to host this in a Kubernetes cluster for """fun""". Here are some brief notes for my own sake.

## General 

This was hosted on a Digital Ocean Kubernetes Cluster.

The topology was very simple: one public-facing ingress distributing traffic to 3 services (hs-captureserv.yaml, hs-pageserv.yaml, hs-web.yaml).

I didn't have to bother authenticating Kubernetes with the container registry because I used a private DO-hosted container registry.

## Ingress and cert-manager

See [How To Set Up an Nginx Ingress on DigitalOcean Kubernetes Using Helm](https://www.digitalocean.com/community/tutorials/how-to-set-up-an-nginx-ingress-on-digitalocean-kubernetes-using-helm)

The manifests production_issuer.yaml and hs-ingress.yaml are artifacts of those instructions.

Some quirks of these instructions:

- The auto-created load balancer is size small
- Encryption is terminated at ingress, not at load balancer. As a result, all traffic appears to come from load balancer which would e.g. rate limiting harder.

## Other packages

### Coredns

Page-serv used to communicate with another internal service. When this was true, using [CoreDNS](https://kubernetes.io/docs/tasks/administer-cluster/coredns/) simplified service resolution.

### Logs and Metrics

I used Grafana/Loki to monitor logs and set up some dashboards. I chose JSON-formatted request logging in backend services because Loki can parse those by default. Something in the logging stack prepended some extra info to the beginning of every log line. Here's an example of a Loki query that stripped out the front matter and parsed the rest as JSON:

```
{app="hs-pageserv"} |= "statusCode" | regexp "(?P<payload>\\{.*})" | line_format "{{.payload}}" | json | meta_res_statusCode != 200
```

I used Prometheus for a while. The memory footprint of a Prometheus deployment was very high for my cheap/small project so I decided to remove it.

### `helm list` output

```shell
$ helm list -A
NAME          	NAMESPACE  	REVISION	UPDATED                                	STATUS  	CHART               	APP VERSION
ingress-nginx 	default    	1       	2021-02-20 16:43:55.57271289 -0800 PST 	deployed	ingress-nginx-3.23.0	0.44.0     
loki          	loki-stack 	1       	2021-04-02 17:10:49.190134786 +0000 UTC	deployed	loki-stack-2.3.1    	v2.1.0     
metrics-server	kube-system	1       	2021-02-21 01:28:10.788108586 +0000 UTC	deployed	metrics-server-5.3.1	0.4.1    
```

## Development

Updates propagated like this:

1. On merge, a GitHub action built a docker image and pushed it to a private container registry
2. The image tag would be updated in one of the manifest files
3. The change would be applied using `kubectl apply -f`
4. The manifest update would be pushed to source control