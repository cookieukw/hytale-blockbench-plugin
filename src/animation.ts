const FPS = 60;

function parseAnimationFile(content: any) {

}
interface IAnimationObject {
    position?: IKeyframe[]
    orientation?: IKeyframe[]
    shapeStretch?: IKeyframe[]
    shapeVisible?: IKeyframe[]
    shapeUvOffset?: IKeyframe[]
}
interface IKeyframe {
    time: number
    delta: {x: number, y: number, z: number}
    interpolationType: 'smooth' | 'linear'
}
function compileAnimationFile(animation: _Animation) {
    const nodeAnimations: Record<string, IAnimationObject> = {};
    const file = {
        formatVersion: 1,
        duration: animation.length / FPS,
        holdLastKeyframe: animation.loop == 'hold',
        nodeAnimations,
    }
    for (let uuid in animation.animators) {
        let animator = animation.animators[uuid];
        let name = animator.name;
        nodeAnimations[name] = {};

        for (let channel in animator.channels) {
            let timeline: IKeyframe[];
            switch (channel) {
                case 'position': timeline = nodeAnimations[name].position = []; break;
                case 'rotation': timeline = nodeAnimations[name].orientation = []; break;
                case 'scale': timeline = nodeAnimations[name].shapeStretch = []; break;
            }
            for (let kf of animator[channel] as _Keyframe[]) {
                let kf_output: IKeyframe = {
                    time: Math.round(kf.time * FPS),
                    delta: {
                        x: kf.data_points[0].x,
                        y: kf.data_points[0].y,
                        z: kf.data_points[0].z,
                    },
                    interpolationType: kf.interpolation == 'catmullrom' ? 'smooth' : 'linear'
                };
                timeline.push(kf_output);
            }
        }
    }
    return file;
}

export function setupAnimationActions(): Action[] {
    let import_anim = new Action('import_blockyanim', {
        name: 'Import Blockyanim',
        click() {

        }
    })
    let export_anim = new Action('export_blockyanim', {
        name: 'Export Blockyanim',
        click() {
            let animation: _Animation;
            // @ts-ignore
            animation = Animation.selected;
            let content = compileJSON(compileAnimationFile(animation));
			Filesystem.exportFile({
				resource_id: 'blockyanim',
				type: 'Blockyanim',
				extensions: ['blockyanim'],
                name: animation.name,
                content
			})
        }
    })
    return [import_anim, export_anim];
}