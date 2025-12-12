import { track } from "./cleanup";
import { FORMAT_IDS } from "./formats";

const MAX_NODE_COUNT = 255;
function getNodeCount() {
    let node_count = 0;
    for (let group of Group.all) {
        if (group.export == false) return;
        if (Collection.all.find(c => c.contains(group))) continue;
        node_count++;
        let cube_count = 0;
        for (let cube of group.children) {
            if (cube instanceof Cube == false || cube.export == false) continue;
            cube_count++;
            if (cube_count > 1) node_count++;
        }
    }
    return node_count;
}

export function setupChecks() {
    let check = new ValidatorCheck('hytale_node_count', {
        update_triggers: ['update_selection'],
        condition: {formats: FORMAT_IDS},
        run(this: ValidatorCheck) {
            let node_count = getNodeCount();
            if (node_count > MAX_NODE_COUNT) {
                this.fail({
                    message: `The model contains ${node_count} nodes, which exceeds the maximum of ${MAX_NODE_COUNT} that Hytale will display.`
                });
            }
        }
    })
    track(check);

	let listener = Blockbench.on('display_model_stats', ({stats}) => {
        if (!FORMAT_IDS.includes(Format.id)) return;
        let node_count = getNodeCount();
        stats.splice(0, 0, {label: 'Nodes', value: node_count + ' / ' + MAX_NODE_COUNT})
    });
    track(listener);
}
