import React, {useEffect, useState} from 'react'
import UsersList from '../Components/UsersList'
import ErrorModal from '../../Shared/Components/UIElements/ErrorModal'
import LoadingSpinner from '../../Shared/Components/UIElements/LoadingSpinner'
import useHttpClient from '../../Shared/Hooks/http-hook'


export default function Users() {
  const [loadedUsers,setLoadedUsers] = useState()
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(()=>{
    const fetchUsers = async ()=>{
    try{
      const response = await sendRequest('http://localhost:4000/api/users/', 'GET', {
        
      },
      {
        'Content-Type': 'application/json',
      }
    );

      setLoadedUsers(response.data.users)
    }catch(error){
    
    }}
    fetchUsers()
  }, [sendRequest]);

  

  return (
    <>
    <ErrorModal error = {error} onClear={clearError}/>
    {isLoading && (
      <div className="center">
        <LoadingSpinner/>
      </div>
    )}
    {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
    </>
  )
}