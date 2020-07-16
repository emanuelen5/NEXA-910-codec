import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap';
import 'jquery';

require('./index.html');
import App from './app';

ReactDOM.render(
	<App/>,
	document.getElementById('app')
);
