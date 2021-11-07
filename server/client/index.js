import React from 'react';
import ReactDOM from 'react-dom';

import 'jquery';
import './bootstrap.scss';
import "@mdi/font/css/materialdesignicons.css";

import App from './app';

const STORAGE_CONFIG = 'config';
const STORAGE_SWITCHES = 'switches';

class StorageItem {
    constructor(name, def = {}) {
        this.storage = window.localStorage;
        this.name = name;
        this.value = StorageItem.load(this.storage, name, def);
        this.def = def;
        this.save();
    };

    save() {
        this.storage.setItem(this.name, this.as_string());
    };

    get(name) {
        return this.value[name];
    };

    reset() {
        this.value = this.def;
        this.save();
    };

    set(name, value) {
        this.value[name] = value;
        this.save();
    }

    static load(storage, name, def = {}) {
        const previous_value = storage.getItem(name);
        if (previous_value) {
            return JSON.parse(previous_value);
        }
        return def;
    };

    as_string() {
        return JSON.stringify(this.value);
    };
};

const config = new StorageItem(STORAGE_CONFIG, {is_initialized: false});
const switches = new StorageItem(STORAGE_SWITCHES, [
        {name: '1',   index: 0,  group: 0x25},
        {name: '2',   index: 1,  group: 0x25},
        {name: '3',   index: 2,  group: 0x25},
        {name: 'all', index: -1, group: 0x25},
]);

ReactDOM.render(
    <App config={config} switches={switches}/>,
    document.getElementById('app')
);
