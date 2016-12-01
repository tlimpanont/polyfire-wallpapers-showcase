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
var firebase = require('firebase');
var PhotosGrid = (function (_super) {
    __extends(PhotosGrid, _super);
    function PhotosGrid() {
        _super.call(this);
        this.files = [];
    }
    PhotosGrid.prototype.hasNoPhotos = function (files) {
        return files.length <= 0 || !files;
    };
    PhotosGrid.prototype._deleteImage = function (event) {
        var _this = this;
        Promise.all([
            firebase.database().ref('/files').child(event.model.file.key).remove(),
            firebase.storage().ref('/files').child(event.model.file.name).delete()
        ]).then(function () {
            _this.file = event.model.file;
            _this.$.toast.open();
        });
    };
    PhotosGrid.prototype.ready = function () {
        var _this = this;
        firebase.database().ref('/files').orderByKey().on('value', function (snapshot) {
            _this.files = _.chain(snapshot.val()).keys().map(function (key, i) {
                var object = _.values(snapshot.val())[i];
                object["key"] = key;
                return object;
            }).value().reverse();
        });
        this.$.toast.positionTarget = document.querySelector('neon-animated-pages');
    };
    __decorate([
        property({
            type: Array,
            value: []
        })
    ], PhotosGrid.prototype, "files", void 0);
    __decorate([
        property({
            type: Object,
        })
    ], PhotosGrid.prototype, "file", void 0);
    __decorate([
        computed({ type: Boolean })
    ], PhotosGrid.prototype, "hasNoPhotos", null);
    PhotosGrid = __decorate([
        component("photos-grid"),
        behavior(Polymer['NeonAnimatableBehavior']),
        behavior(Polymer['IronResizableBehavior'])
    ], PhotosGrid);
    return PhotosGrid;
}(polymer.Base));
exports.PhotosGrid = PhotosGrid;
