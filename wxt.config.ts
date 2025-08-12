import { defineConfig } from 'wxt';
import { buildConfig } from './wxt-common.config';

export default defineConfig(buildConfig({
    description: 'Stream Games Assistant',

    zip: {
        artifactTemplate: 'sga@v{{version}}.zip'
    }
}));
