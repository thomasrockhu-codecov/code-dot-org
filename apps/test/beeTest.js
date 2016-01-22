var chai = require('chai');
chai.config.includeStack = true;
var assert = chai.assert;

var testUtils = require('./util/testUtils');

testUtils.setupLocales();

var Bee = require('@cdo/apps/maze/bee');
var utils = require('@cdo/apps/utils');

var baseLevel = {
  honeyGoal: 1,
  map: [
    [ 0 ]
  ],
  flowerType: 'redWithNectar',
  startDirection: 1,
  rawDirt: [
    [ 0 ]
  ]
};

describe("Bee", function () {
  it("fails if no flowerType", function () {
    var maze = {};
    var config = {
      level: baseLevel
    };
    delete config.level.flowerType;
    assert.throws(function () {
      new Bee(maze, null, config);
    }, Error, /bad flowerType for Bee/);
  });


  it("fails if invalid flowerType", function () {
    var maze = {};
    var config = {
      level: utils.extend(baseLevel, {
        flowerType: 'invalid'
      })
    };
    assert.throws(function () {
      new Bee(maze, null, config);
    }, Error, /bad flowerType for Bee/);
  });

  describe("isRedFlower", function () {
    /**
     * Shim a 1x1 maze with the given values and validate that we get the
     * expected result when calling isRedFlower
     */
    function validate(flowerType, rawDirtValue, expected, msg) {
      var maze = {};
      var config = {
        level: utils.extend(baseLevel, {
          flowerType: flowerType,
          rawDirt: [[rawDirtValue]]
        })
      };
      var bee = new Bee(maze, null, config);
      assert.equal(bee.isRedFlower(0, 0), expected, msg);
    }

    it("red default", function () {
      validate('redWithNectar', '+1', true, 'default flower');
      validate('redWithNectar', '-1', false, 'default hive');
      validate('redWithNectar', '+1P', false, 'overriden purple');
      validate('redWithNectar', '+1R', true, 'overriden red');
      validate('redWithNectar', '+1FC', true, 'overriden cloud');
    });

    it("purple default", function () {
      validate('purpleNectarHidden', '+1', false, 'default flower');
      validate('purpleNectarHidden', '-1', false, 'default hive');
      validate('purpleNectarHidden', '+1P', false, 'overriden purple');
      validate('purpleNectarHidden', '+1R', true, 'overriden red');
      validate('purpleNectarHidden', '+1FC', false, 'overriden cloud');
    });
  });
});
