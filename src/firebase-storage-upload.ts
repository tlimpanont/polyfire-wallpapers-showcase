declare let firebase: any;
import * as _ from 'lodash';

@component('firebase-storage-upload')
export class FirebaseStorageUpload extends polymer.Base {

    @property({
        type: Array,
        value: []
    })
    files: Array<any>;

    constructor() {
        super();
    }

    attached() {

        this.addEventListener('upload-error', this.uploadError.bind(this));
        this.addEventListener('upload-success', this.uploadSuccess.bind(this));
        this.addEventListener('upload-complete', this.uploadComplete.bind(this));

        this.$.upload.addEventListener('upload-request', this.uploadRequest.bind(this));
        this.$.upload.addEventListener('upload-abort', this.uploadAbort.bind(this));
        this.$.upload.addEventListener('upload-retry', this.uploadRetry.bind(this));

        this.$.upload.addEventListener('drop', this.handleFileSelect.bind(this));

        let uploadDOM: any = Polymer.dom(this.$.upload);

        uploadDOM.node.$.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleFileSelect(event) {
        let files = (event.dataTransfer) ? event.dataTransfer.files : event.currentTarget.files;

        this.files = Array.from(files).map((file: any) => {
            return {
                file: file,
                name: file.name,
                progress: 0,
                complete: false
            }
        });

        this.files.forEach((file, index) => {
            this.uploadFile(file, index);
        });
    }

    uploadFile(file, index) {

        let storage = firebase.storage();

        let storageRef = storage.ref();

        let filesRef = storageRef.child('files');

        let spaceRef = filesRef.child(file.name);

        let task = spaceRef.put(file.file);

        this.set(`files.${index}.task`, task);
        this.set(`fch
        iles.${index}.index`, index);

        task.on('state_changed',
            (snapshot) => {
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.set(`files.${index}.progress`, progress);
            },
            (error) => {
                this.fire('upload-error', error);
            },
            () => {
                this.set(`files.${index}.complete`, true);
                this.set(`files.${index}.downloadURL`, task.snapshot.downloadURL);

                firebase.database().ref().child('/files').push({
                    timestamp: new Date().getTime(),
                    name: file.name,
                    downloadURL: task.snapshot.downloadURL
                });

                let completedCount = (_.countBy(this.files, 'complete') as any).true;
                if (completedCount >= this.files.length) {
                    this.fire('upload-complete', this.files);
                } else {
                    this.fire('upload-success', file);
                }
            }
        );
    }

    uploadRequest(event) {
        event.preventDefault();
    }

    uploadSuccess(event) {

    }

    uploadError(event) {

    }

    uploadComplete(event) {
        this.set('files', []);
    }

    uploadAbort(event) {
        event.detail.file.task.cancel();
    }

    uploadRetry(event) {
        event.detail.file.task.cancel();
        this.uploadFile(event.detail.file, event.detail.file.index);
    }

    detached() {

    }

    attributeChanged() {

    }
}
