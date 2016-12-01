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
var firebase = require('firebase');
var _ = require('lodash');
var FirebaseStorageUpload = (function (_super) {
    __extends(FirebaseStorageUpload, _super);
    function FirebaseStorageUpload() {
        _super.call(this);
    }
    FirebaseStorageUpload.prototype.attached = function () {
        this.addEventListener('upload-error', this.uploadError.bind(this));
        this.addEventListener('upload-success', this.uploadSuccess.bind(this));
        this.addEventListener('upload-complete', this.uploadComplete.bind(this));
        this.$.upload.addEventListener('upload-request', this.uploadRequest.bind(this));
        this.$.upload.addEventListener('upload-abort', this.uploadAbort.bind(this));
        this.$.upload.addEventListener('upload-retry', this.uploadRetry.bind(this));
        this.$.upload.addEventListener('drop', this.handleFileSelect.bind(this));
        var uploadDOM = Polymer.dom(this.$.upload);
        uploadDOM.node.$.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    };
    FirebaseStorageUpload.prototype.handleFileSelect = function (event) {
        var _this = this;
        var files = (event.dataTransfer) ? event.dataTransfer.files : event.currentTarget.files;
        this.files = Array.from(files).map(function (file) {
            return {
                file: file,
                name: file.name,
                progress: 0,
                complete: false
            };
        });
        this.files.forEach(function (file, index) {
            _this.uploadFile(file, index);
        });
    };
    FirebaseStorageUpload.prototype.uploadFile = function (file, index) {
        var _this = this;
        var storage = firebase.storage();
        var storageRef = storage.ref();
        var filesRef = storageRef.child('files');
        var spaceRef = filesRef.child(file.name);
        var task = spaceRef.put(file.file);
        this.set("files." + index + ".task", task);
        this.set("files." + index + ".index", index);
        task.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            _this.set("files." + index + ".progress", progress);
        }, function (error) {
            _this.fire('upload-error', error);
        }, function () {
            _this.set("files." + index + ".complete", true);
            _this.set("files." + index + ".downloadURL", task.snapshot.downloadURL);
            firebase.database().ref().child('/files').push({
                timestamp: new Date().getTime(),
                name: file.name,
                downloadURL: task.snapshot.downloadURL
            });
            var completedCount = _.countBy(_this.files, 'complete').true;
            if (completedCount >= _this.files.length) {
                _this.fire('upload-complete', _this.files);
            }
            else {
                _this.fire('upload-success', file);
            }
        });
    };
    FirebaseStorageUpload.prototype.uploadRequest = function (event) {
        event.preventDefault();
    };
    FirebaseStorageUpload.prototype.uploadSuccess = function (event) {
    };
    FirebaseStorageUpload.prototype.uploadError = function (event) {
    };
    FirebaseStorageUpload.prototype.uploadComplete = function (event) {
        this.set('files', []);
    };
    FirebaseStorageUpload.prototype.uploadAbort = function (event) {
        event.detail.file.task.cancel();
    };
    FirebaseStorageUpload.prototype.uploadRetry = function (event) {
        event.detail.file.task.cancel();
        this.uploadFile(event.detail.file, event.detail.file.index);
    };
    FirebaseStorageUpload.prototype.detached = function () {
    };
    FirebaseStorageUpload.prototype.attributeChanged = function () {
    };
    __decorate([
        property({
            type: Array,
            value: []
        })
    ], FirebaseStorageUpload.prototype, "files", void 0);
    FirebaseStorageUpload = __decorate([
        component('firebase-storage-upload')
    ], FirebaseStorageUpload);
    return FirebaseStorageUpload;
}(polymer.Base));
exports.FirebaseStorageUpload = FirebaseStorageUpload;
