import React, { useEffect, useState } from "react";
import FirebaseContext from '../../firebase/context'
import LinkItem from './LinkItem'
import { LINKS_PER_PAGE } from '../../utils/index'


function LinkList(props) {

  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = useState([])
  const IsNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top');


  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe()
  }, [isTopPage])

  function getLinks() {
    if(isTopPage){
      return firebase.db
      .collection('links')
      .orderBy('voteCount', 'desc')
      /*.limit(LINKS_PER_PAGE)*/
      .onSnapshot(handleSnapshot)
    }
    return firebase.db
    .collection('links')
    .orderBy('created', 'desc')
    /*.limit(LINKS_PER_PAGE)*/
    .onSnapshot(handleSnapshot)
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    setLinks(links)
  }

  function renderLinks() {
    if(IsNewPage) {
      return links
    }
    const topLinks = links.slice().sort((l1, l2) => l2.votes.length - l1.votes.length);
    return topLinks
  }
  
  return (
    <div>
      {/* renderLinks() ao invés usar links */}
      {renderLinks().map((link, index) => (
        <LinkItem key={link.id} showCount={true} link={link} index={index + 1} />
      ))}
    </div>
  )
}

export default LinkList;
