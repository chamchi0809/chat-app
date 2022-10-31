import styled from '@emotion/styled';
import React, { useState, useEffect, useMemo} from 'react'
import oc from 'open-color'
import Header from '../atoms/Header';
import { BsPeopleFill } from 'react-icons/bs';
import Button from '../atoms/Button';
import SearchInput from '../atoms/SearchInput';
import { IUser } from '../../pages/api/schema';
import Auth from '../../utils/Auth';
import Friend from '../organisms/Friend';
import Input from '../atoms/Input';
import UserDB from '../../utils/UserDB';
import { useFriendStore } from '../../zustand/Friend';

type friendsTabType = 'ONLINE' | 'ALL' | 'ADD FRIEND';

const StyledFriendsList = styled.div`

position: relative;
color :${oc.gray[4]};
min-height: 100vh;
background-color: ${oc.gray[7]};
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-content: flex-start;
flex: 1;
scroll-behavior: auto;

.friends{
  padding-bottom: 10px;
  overflow-y: overlay;
  &::-webkit-scrollbar-track
  {
    background-color: rgba(0,0,0,0);
  }

  &::-webkit-scrollbar
  {
    width: 8px;
    background-color: rgba(0,0,0,0);
  }

  &::-webkit-scrollbar-thumb
  {
    border-radius: 6px;
    background-color: ${oc.gray[9]};
  }
}

&>.topSection{
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${oc.gray[8]};
  button{
    height: fit-content;
    padding:5px;
    margin-right: 15px;
  }
}

&>.bottomSection{
  margin-top: auto;
}
&>.leftSection{
  width: 70%;
  height: 100%;
  border-right: 1px solid ${oc.gray[6]};
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-top:10px;

  .friends{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 15px;
    width: 100%;
    overflow-y: overlay;
    &::-webkit-scrollbar-track
    {
      background-color: rgba(0,0,0,0);
    }

    &::-webkit-scrollbar
    {
      width: 8px;
      background-color: rgba(0,0,0,0);
    }

    &::-webkit-scrollbar-thumb
    {
      border-radius: 6px;
      background-color: ${oc.gray[9]};
    }
  }
  .searchInput{
    width: 100%;
  }
}
.friendActivities{
  width: 30%;
}
`;

const FriendsList:React.FC=()=>{


  const auth = Auth.getAuth();
  const userDB = UserDB.getUserDB();
  const {friends, setFriends} = useFriendStore();
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [selectedTab, setSelectedTab] = useState<friendsTabType>('ONLINE');
  const [filterInput, setFilterInput] = useState<string>('');

  const filteredFriends = useMemo<IUser[]>(()=>{
    if(filterInput === '') return friends;
    const value = filterInput.toUpperCase();

    return friends.filter((friend)=>{
      return friend.username.toUpperCase().includes(value);
    })

  },[friends, filterInput])
  const selectedTabFriends = useMemo<IUser[]>(()=>{
    switch(selectedTab){
      case 'ONLINE':
        return filteredFriends?.filter(user=>user.status!=='offline');
      case 'ALL':
        return filteredFriends;
      case 'ADD FRIEND':
        return searchResult.filter(user=>!friends?.find(friend=>friend._id===user._id) && user._id !== auth.user?._id);
    }
    
  },[filteredFriends, selectedTab, searchResult]);
  

  useEffect(()=>{
    
    if(auth.user){
      setFriends(auth.user);
    }else{
      (async()=>{
        setFriends(await auth.getUser())
      })
    }
  },[auth.user])

  useEffect(()=>{
    (async () => {
      setSearchResult(await userDB.searchUsers(filterInput));
    })()
  },[filterInput])



  return (
    <StyledFriendsList>
      <div className="topSection">
        <Header size='sm' color={oc.gray[2]}><BsPeopleFill/>&nbsp;&nbsp;Friends</Header>
        <Button color={oc.white} highlightOffset={2} active={selectedTab==='ONLINE'} onClick={()=>{
          setSelectedTab('ONLINE')
        }}>Online</Button>
        <Button color={oc.white} highlightOffset={2} active={selectedTab==='ALL'} onClick={()=>{
          setSelectedTab('ALL')
        }}>All</Button>
        <Button color={oc.white} colorScheme={'gray'} highlightOffset={2} active={selectedTab==='ADD FRIEND'} onClick={()=>{
          setSelectedTab('ADD FRIEND')
        }}>Add Friend</Button>
      </div>
      <div className="leftSection">
        <SearchInput bgcolor={oc.gray[8]} color={oc.gray[3]} size={'md'} onChange={(e)=>{
          setFilterInput(e.target.value)
          }} value={filterInput} placeholder='Search' setValue={setFilterInput}/>
        <div className="friends">
          <span>{selectedTab} - {selectedTabFriends?.length}</span>
          {
            selectedTabFriends?.map((friend,i)=><Friend user={friend} key={i}/>)
          }
        </div>
      </div>
      <div className="friendActivities">
        <Header size='sm' color={oc.gray[2]}>Active Now</Header>
      </div>
    </StyledFriendsList>
  )
}

export default FriendsList 