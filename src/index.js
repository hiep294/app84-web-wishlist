import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { onSnapshot, getSnapshot, addMiddleware } from 'mobx-state-tree';

import { Group } from './models/Group';

let initialState = {
  users: {}
};

// if(localStorage.getItem('wishlistapp')) {
//   const json = JSON.parse(localStorage.getItem('wishlistapp'))
//   if(WishList.is(json)) initialState = json;
// }

let group = (window.group = Group.create(initialState));
// group.load();
// group.users.values()
// onSnapshot(wishList, snapshot => {
//   localStorage.setItem('wishlistapp', JSON.stringify(snapshot));
// }); // only fire at the end of the current Mobx (trans)action

// addMiddleware(group, (call, next) => {
//   console.log(`[${call.type} ${call.name}]`);
//   return next(call);
// });

function renderApp() {
  ReactDOM.render(<App group={group} />, document.getElementById('root'));
}

renderApp();

// webpack: just for reload page faster after modifying
// if (module.hot) {
//   module.hot.accept(['./App.js'], () => {
//     renderApp();
//   });

//   module.hot.accept(['./models/Group'], () => {
//     // new model definitions
//     const snapshot = getSnapshot(Group);
//     group = window.group = Group.create(snapshot);
//     renderApp();
//   });
// }
