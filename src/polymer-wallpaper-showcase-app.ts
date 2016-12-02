declare const firebase: any;

import * as _ from 'lodash';

@component("polyfire-wallpapers-showcase-app")
export class PolyfireWallpapersShowcaseApp extends polymer.Base {
    @property({
        type: String,
        reflectToAttribute: true,
    })
    page: string;

    @property({
        type: Array,
        value: []
    })
    files: Array<any> = [];

    @property({
        type: Object
    })
    route: Object;

    @observe("route.*")
    _routePageChanged(page) {

        if (page.path === 'route') {
            this.page = page.value.path || 'photos-grid';
        }
    }

    @computed({type: Boolean})
    _hasNoPhotos(files): Boolean {
        return files.length <= 0 || !(files);
    }

    @observe("page")
    _pageChanged(page) {
        // Load page import on demand. Show 404 page if fails
        var resolvedPageUrl = this.resolveUrl(`${page}.html`);
        this.importHref(resolvedPageUrl, null, null, true);
    }

    constructor() {
        super();
    }

    openUploadDialog() {
        this.$.dialog.open();
    }

    beforeRegister() {
    }

    ready() {
        this.$.upload.addEventListener('upload-complete', () => {
            this.$.dialog.close();
        });

        firebase.database().ref('/files').on('value', (snapshot) => {
            this.files = _.values(snapshot.val());
        });
    }

    goToPage(event) {
        this.page = event.currentTarget.getAttribute('name');
        window.location.hash = this.page;
    }
}
