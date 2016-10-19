/**
 * Utility for getting the current config
 */
import fs from 'fs-extra';
import deepAssign from 'deep-assign';
import defaults from '../../config.json';

export default function getConfig(configPath = null) {
  let config = {};
  if (configPath) {
    config = fs.readJsonSync(configPath);
  }
  return deepAssign(defaults, config);
}
