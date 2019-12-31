import { types, getParent, destroy } from 'mobx-state-tree';
import uuid from 'uuid';

// const data = {
//   name: 'Chronicles of Narnia Box Set - Lewis',
//   price: 28.73,
//   image: ''
// };

export const WishListItem = types
  .model('WistListItem')
  .props({
    id: types.optional(types.identifier, uuid()),
    name: types.optional(types.string, ''),
    price: types.optional(types.number, 0),
    image: ''
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    },
    changePrice(newPrice) {
      self.price = newPrice;
    },
    changeImage(newImage) {
      self.image = newImage;
    },
    remove() {
      // can remove it self from parent
      getParent(self, 2).remove(self);
      // equal to getParent(getParent(self)).remove(self)
    }
  }));

export const WishList = types
  .model('WishList')
  .props({
    items: types.array(WishListItem)
  })
  .actions(self => ({
    add(newItem) {
      self.items.push(newItem);
    },
    remove(item) {
      // console.log('removing');
      // self.items.splice(self.items.indexOf(item), 1);
      destroy(item); // should call destroy here, the item is protected by it self
    }
  }))
  .views(self => ({
    // to get a list like, list.totalPrice without define any property more
    get totalPrice() {
      return self.items.reduce((sum, entry) => sum + entry.price, 0);
    }
  }));
