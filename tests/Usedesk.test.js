/* global describe test expect */
const path = require('path');
const { Kubiks: { Config } } = require('rubik-main');

const { createApp, createKubik } = require('rubik-main/tests/helpers/creators');

const Usedesk = require('../classes/Usedesk.js');

const CONFIG_VOLUMES = [
  path.join(__dirname, '../default/'),
  path.join(__dirname, '../config/')
];

const getApp = () => {
  const app = createApp();
  app.add(new Config(CONFIG_VOLUMES));

  return app;
};

describe('Кубик для работы с Usedesk', () => {
  test('Создается без проблем и добавляется в App', () => {
    const app = getApp();
    const kubik = createKubik(Usedesk, app);
    expect(app.usedesk).toBe(kubik);
    expect(app.get('usedesk')).toBe(kubik);
  });
});
