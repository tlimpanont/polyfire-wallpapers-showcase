"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _ = require('lodash');
var MyApp = (function (_super) {
    __extends(MyApp, _super);
    function MyApp() {
        _super.call(this);
        this.files = [];
    }
    MyApp.prototype._routePageChanged = function (page) {
        if (page.path === 'route') {
            this.page = page.value.path || 'photos-grid';
        }
    };
    MyApp.prototype._hasNoPhotos = function (files) {
        return files.length <= 0 || !(files);
    };
    MyApp.prototype._pageChanged = function (page) {
        // Load page import on demand. Show 404 page if fails
        var resolvedPageUrl = this.resolveUrl(page + ".html");
        this.importHref(resolvedPageUrl, null, this._showPage404, true);
    };
    MyApp.prototype.openUploadDialog = function () {
        this.$.dialog.open();
    };
    MyApp.prototype.beforeRegister = function () {
    };
    MyApp.prototype.ready = function () {
        var _this = this;
        this.$.upload.addEventListener('upload-complete', function () {
            _this.$.dialog.close();
        });
        firebase.database().ref('/files').on('value', function (snapshot) {
            _this.files = _.values(snapshot.val());
        });
    };
    MyApp.prototype.goToPage = function (event) {
        this.page = event.currentTarget.getAttribute('name');
        window.location.hash = this.page;
    };
    MyApp.prototype._showPage404 = function () {
        this.page = 'my-view404';
    };
    __decorate([
        property({
            type: String,
            reflectToAttribute: true,
        })
    ], MyApp.prototype, "page", void 0);
    __decorate([
        property({
            type: Array,
            value: []
        })
    ], MyApp.prototype, "files", void 0);
    __decorate([
        property({
            type: Object
        })
    ], MyApp.prototype, "route", void 0);
    __decorate([
        observe("route.*")
    ], MyApp.prototype, "_routePageChanged", null);
    __decorate([
        computed({ type: Boolean })
    ], MyApp.prototype, "_hasNoPhotos", null);
    __decorate([
        observe("page")
    ], MyApp.prototype, "_pageChanged", null);
    MyApp = __decorate([
        component("my-app")
    ], MyApp);
    return MyApp;
}(polymer.Base));
exports.MyApp = MyApp;
