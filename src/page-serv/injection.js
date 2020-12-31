const awilix = require('awilix');
const dummyDal = require('./dummyDal')
const captureService = require('./captureService')

const container = awilix.createContainer();
container.register({
    dal: awilix.asFunction(dummyDal.makeDal),
    captureService: awilix.asFunction(captureService.makeCaptureService),
})

module.exports = { container }
