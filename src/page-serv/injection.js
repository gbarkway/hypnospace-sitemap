const awilix = require('awilix');
const dummyDal = require('./dummyDal');
const mongoDal = require('./mongoDal');
const captureService = require('./captureService')

const container = awilix.createContainer();
container.register({
    dal: awilix.asFunction(mongoDal.makeDal),
    captureService: awilix.asFunction(captureService.makeCaptureService),
})

module.exports = { container }
