import { getSnapshot } from 'mobx-state-tree';
import { WishList, WishListItem } from './WishList';
import { reaction } from 'mobx';
it('can create a instance of a model', () => {
  const item = WishListItem.create({
    name: 'Chronicles of Narnia Box Set - Lewis',
    price: 28.73
  });

  expect(item.price).toBe(28.73);
  expect(item.image).toBe('');
  item.changeName('Narnia');
  expect(item.name).toBe('Narnia');
  item.changePrice(30);
  expect(item.price).toBe(30);
  item.changeImage('newImageHere');
  expect(item.image).toBe('newImageHere');
});

it('can create a wishlist', () => {
  const list = WishList.create({
    items: [
      {
        name: 'Chronicles of Narnia Box Set - Lewis',
        price: 28.73
      }
    ]
  });

  expect(list.items.length).toBe(1);
  expect(getSnapshot(list)).toEqual({
    items: [
      {
        name: 'Chronicles of Narnia Box Set - Lewis',
        price: 28.73,
        image: ''
      }
    ]
  });
});

it('can add new items', () => {
  const list = WishList.create();
  list.add({
    name: 'Chesterton',
    price: 10
  }); // just need to test a snapshot
  expect(list.items.length).toBe(1);
});

it('can calculate the total price of a wishlist', () => {
  const list = WishList.create({
    items: [
      {
        name: 'Manchine Gun Preacher',
        price: 7.35
      },
      {
        name: 'LEGO Mindstor EV3',
        price: 349.95
      }
    ]
  });

  expect(list.totalPrice).toBe(357.3);

  let changed = 0;
  reaction(
    () => list.totalPrice,
    () => changed++
  );

  expect(changed).toBe(0);
  console.log(list.totalPrice);
  list.items[0].changeName('Test Reaction');
  expect(changed).toBe(0);

  list.items[0].changePrice(10);
  console.log(list.totalPrice);
  expect(changed).toBe(1);
});
