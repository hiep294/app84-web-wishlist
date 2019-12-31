import {
  types,
  flow,
  getParent,
  getSnapshot,
  applySnapshot,
  onSnapshot
} from 'mobx-state-tree';
import { WishList } from './WishList';
import { values } from 'mobx';

const User = types
  .model('User')
  .props({
    id: types.identifier,
    name: types.optional(types.string, ''),
    gender: types.optional(types.enumeration('gender', ['m', 'f']), 'm'),
    wishList: types.optional(WishList, {}),
    recipient: types.maybe(types.reference(types.late(() => User)))
  })
  .actions(self => ({
    getSuggestions: flow(function*() {
      // * like async, yield like await
      const res = yield window.fetch(
        `http://localhost:3001/suggestions_${self.gender}`
      );
      const suggestions = yield res.json();
      self.wishList.items.push(...suggestions);
    }),
    save: flow(function* save() {
      try {
        yield window.fetch(`http://localhost:3001/users/${self.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(getSnapshot(self))
        });
      } catch (error) {
        console.error('Failed to save ', error);
      }
    }),
    afterCreate() {
      // applied when calling new item, modify one, save wishlist item, or remove it, or click suggestion button
      onSnapshot(self, self.save); // setup listener
      console.log('setted up listener');
    }
  }))
  .views(self => ({
    get other() {
      return getParent(self).get(self.recipient);
    }
  }));

/**
 * types.array and types.map are wrapped in types.optional by default with [] and {}
 */
export const Group = types
  .model('Group')
  .props({
    users: types.map(User)
  })
  .actions(self => {
    let controller;
    return {
      afterCreate() {
        // Lifecycle hooks overview, run "after an instance is created and initial values are applied."
        // https://mobx-state-tree.js.org/overview/hooks
        self.load();
      },
      beforeDestroy() {
        // https://mobx-state-tree.js.org/overview/hooks
        if (controller) controller.abort();
      },
      reload() {
        if (controller) controller.abort();
        self.load();
      },
      load: flow(function* load() {
        controller = window.AbortController && new window.AbortController();
        try {
          const res = yield window.fetch('http://localhost:3001/users', {
            signal: controller && controller.signal
          });
          applySnapshot(self.users, yield res.json());
          console.log('success');
        } catch (error) {
          console.log('aborted ', error.name);
        }
      }),
      drawLots() {
        // * optional thinking
        const allUsers = values(self.users).slice();
        let remaining = allUsers.slice();
        allUsers.forEach(user => {
          // edge case: the only person without recipient
          // is the same as the only remaining lot
          // swap lot's with some random other person
          if (remaining.length === 1 && remaining[0] === user) {
            const remaining2 = allUsers.filter(u => u.id !== user.id);
            const swapWith =
              remaining2[Math.floor(Math.random() * remaining2.length)];
            user.recipient = swapWith;
            console.log('swapped!');
          } else
            while (!user.recipient) {
              // pick random lot from remaining list
              let recipientIdx = Math.floor(Math.random() * remaining.length);

              // if it is not the current user, assign it
              // as recipient and remove the lot
              if (remaining[recipientIdx].id !== user.id) {
                user.recipient = remaining[recipientIdx];
                console.log(user.name, remaining[recipientIdx].name);
                remaining.splice(recipientIdx, 1);
              }
            }
        });
      }
    };
  })
  .views(() => ({}));
