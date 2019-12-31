import React from 'react';
import logo from '../assets/st.png';
import CustomInput from '../components/CustomInput';
import CustomPicker, { CustomPickerItem } from '../components/CustomPicker';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { clone, applySnapshot, getSnapshot } from 'mobx-state-tree';
import { values } from 'mobx';
import { WishListItem } from '../models/WishList';

const WishPage = observer(({ group }) => {
  const [selectedUserID, setSelectedUserID] = React.useState('');
  const selectedUser = group.users.get(selectedUserID);
  return (
    <>
      <div>
        <header className="App-header" style={{ display: 'flex' }}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Lesson 17 - continuing</h1>
        </header>
        <button onClick={group.reload}>Reload</button>
        <CustomPicker
          label="Select User"
          onChange={setSelectedUserID}
          value={selectedUserID}
          pickerItems={() =>
            values(group.users).map(user => (
              <CustomPickerItem
                key={user.id}
                value={user.id}
                label={user.name}
              />
            ))
          }
        />
        <button onClick={group.drawLots}>Draw lots</button>
        {selectedUser && (
          <>
            <WishListView wishList={selectedUser.wishList} />
            <TotalPrice wishList={selectedUser.wishList} />
            <WishListItemEntry wishList={selectedUser.wishList} />
            <button onClick={selectedUser.getSuggestions}>Suggestions</button>
            <hr />
            <h2>{selectedUser.recipient ? selectedUser.recipient.name : ''}</h2>
            {selectedUser.recipient && (
              <>
                <WishListView
                  wishList={selectedUser.recipient.wishList}
                  readonly
                />
                <TotalPrice wishList={selectedUser.recipient.wishList} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
});

export default WishPage;

const TotalPrice = observer(({ wishList }) => {
  // to avoid reloading whole components
  return <>Total: {wishList.totalPrice} $</>;
});

const WishListView = observer(({ wishList, readonly }) => {
  const List = styled.ul`
    list-style: none;
    margin: 0;
  `;
  console.log('list');
  return (
    <List>
      {wishList.items.map(item => (
        <WishListItemView item={item} key={item.id} readonly={readonly} />
      ))}
    </List>
  );
});

const WishListItemView = observer(({ item, readonly }) => {
  console.log(`From item number, `, item.name);
  const [isEditting, setEdittingMode] = React.useState(false);
  const cloneItem = clone(item); // to clone item, when cancel editing, will show the previous value
  // everytime re-render component, cloneItem is always exactly item

  const Image = styled.img`
    width: 50px;
  `;

  const ListItem = styled.li`
    list-style: none;
    align-items: center;
    display: flex;
    border: #c7c7c7 solid 1px;
    border-left: red solid 6px;
    background-color: white;
    padding-right: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
  `;

  if (isEditting) {
    return (
      <>
        <ListItem>
          <WishListItemEdit item={cloneItem} />
        </ListItem>
        <button onClick={() => setEdittingMode(false)}>Close</button>
        <button
          onClick={() => {
            applySnapshot(item, getSnapshot(cloneItem));
            setEdittingMode(false);
          }}
        >
          Save
        </button>
      </>
    );
  }

  return (
    <>
      <ListItem>
        {item.image && <Image src={item.image} alt="" />}
        <h3 style={{ flexGrow: 1 }}>{item.name}</h3>
        <span style={{ display: 'block', textAlign: 'right' }}>
          {item.price} $
        </span>
        {!readonly && (
          <>
            <button onClick={() => setEdittingMode(true)}>Edit</button>
            <button onClick={item.remove}>Remove</button>
          </>
        )}
      </ListItem>
    </>
  );
});

const WishListItemEdit = observer(({ item }) => {
  // observer to use 'changeName' method
  return (
    <div>
      <CustomInput
        demoArrayProp={[
          { id: 1, name: 'hiep' },
          { id: 2, name: 'hiep' },
          { id: 3, name: 'hiep' }
        ]}
        label="Thing"
        value={item.name}
        onChange={e => item.changeName(e.target.value)}
      />
      <CustomInput
        demoArrayProp={[
          { id: 1, name: 'hiep' },
          { id: 2, name: 'hiep' },
          { id: 3, name: 'hiep' }
        ]}
        label="Price"
        value={item.price}
        type="number"
        onChange={e => {
          let newPrice = parseFloat(e.target.value);
          if (isNaN(newPrice)) newPrice = 0;
          item.changePrice(newPrice);
        }}
      />
      <CustomInput
        demoArrayProp={[
          { id: 1, name: 'hiep' },
          { id: 2, name: 'hiep' },
          { id: 3, name: 'hiep' }
        ]}
        label="Image"
        value={item.image}
        onChange={e => item.changeImage(e.target.value)}
      />
    </div>
  );
});

const WishListItemEntry = observer(({ wishList }) => {
  const [entry, setEntry] = React.useState(WishListItem.create({}));
  const add = () => {
    wishList.add(entry);
    setEntry(WishListItem.create({}));
  };

  return (
    <>
      <WishListItemEdit item={entry} />
      <button onClick={add}>Add</button>
    </>
  );
});
