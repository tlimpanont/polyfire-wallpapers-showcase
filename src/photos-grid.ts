declare let firebase: any;

import * as _ from 'lodash';

@component("photos-grid")
@behavior(Polymer['NeonAnimatableBehavior'])
@behavior(Polymer['IronResizableBehavior'])
export class PhotosGrid extends polymer.Base {

    @property({
        type: Array,
        value: []
    })
    files: Array<any> = [];

    @property({
        type: Object,
    })
    file: Object;

    @computed({type: Boolean})
    hasNoPhotos(files): boolean {
        return files.length <= 0 || !files;
    }

    constructor() {
        super();
    }

    _deleteImage(event) {
        Promise.all([
            firebase.database().ref('/files').child(event.model.file.key).remove(),
            firebase.storage().ref('/files').child(event.model.file.name).delete()
        ]).then(() => {
            this.file = event.model.file;
            this.$.toast.open();
        });
    }

    ready() {
        firebase.database().ref('/files').orderByKey().on('value', (snapshot) => {

            this.files = _.chain(snapshot.val()).keys().map((key, i) => {
                let object = _.values(snapshot.val())[i];
                object["key"] = key;
                return object;
            }).value().reverse();

        });


        this.$.toast.positionTarget = document.querySelector('neon-animated-pages');
    }
}
