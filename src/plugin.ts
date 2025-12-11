import { setupAnimationActions } from "./animation";
import { setupAttachments } from "./attachments";
import { cleanup, track } from "./cleanup";
import { setupElements } from "./element";
import { setupChecks } from "./validation";
// @ts-expect-error
import Package from './../package.json'
import { setupFormats } from "./formats";
import { setupPhotoshopTools } from "./photoshop_copy_paste";

BBPlugin.register('hytale_plugin', {
    title: 'Hytale Models',
    author: 'JannisX11, Kanno',
    icon: 'icon.png',
    version: Package.version,
    description: 'Adds support for creating models and animations for Hytale',
    tags: ['Hytale'],
    variant: 'both',
    min_version: '5.0.0',
    has_changelog: true,
    repository: 'https://github.com/JannisX11/hytale-blockbench-plugin',
    bug_tracker: 'https://github.com/JannisX11/hytale-blockbench-plugin/issues',
    onload() {

        setupFormats();
        setupElements();
        setupAnimationActions();
        setupAttachments();
        setupChecks();
        setupPhotoshopTools();

        // Collections panel setting
        let showCollectionsSetting = new Setting('hytale_show_collections', {
            name: 'Show Collections Panel',
            description: 'Show the collections panel on the right sidebar (folded) by default',
            category: 'defaults',
            value: true,
            onChange(value) {
                if (value) {
                    Panels.collections.default_configuration.default_position.slot = 'right_bar';
                    Panels.collections.default_configuration.default_position.folded = true;
                } else {
                    Panels.collections.default_configuration.default_position.slot = 'hidden';
                    Panels.collections.default_configuration.default_position.folded = false;
                }
            }
        });
        track(showCollectionsSetting);

        // Apply setting on load
        if (showCollectionsSetting.value) {
            Panels.collections.default_configuration.default_position.slot = 'right_bar';
            Panels.collections.default_configuration.default_position.folded = true;
        }

        let on_finish_edit = Blockbench.on('generate_texture_template', (arg) => {
            for (let element of arg.elements) {
                if (typeof element.autouv != 'number') continue;
                element.autouv = 1;
            }
        })
        track(on_finish_edit);
        
    },
    onunload() {
        cleanup();
    }
})
