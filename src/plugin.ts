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
        let panel_setup_listener: Deletable;
        function showCollectionPanel(): boolean {
            const local_storage_key = 'hytale_plugin:collection_panel_setup';
            if (localStorage.getItem(local_storage_key)) return true;
            if (!Modes.edit) return false;

            if (Panels.collections.slot == 'hidden') {
                Panels.collections.moveTo('right_bar');
            }
            if (Panels.collections.folded) {
                Panels.collections.fold();
            }
            if (panel_setup_listener) {
                panel_setup_listener.delete();
                panel_setup_listener = undefined;
            }
            localStorage.setItem(local_storage_key, "true");
            return true;
        }
        if (!showCollectionPanel()) {
            panel_setup_listener = Blockbench.on('select_mode', showCollectionPanel);
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
