import React, { useEffect, useState } from "react";
import FirebaseContext from '../../firebase/context'
import LinkItem from './LinkItem'
import { LINKS_PER_PAGE } from '../../utils/index'


function LinkList(props) {

  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const IsNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top');
  const page = Number(props.match.params.page)

  useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe()
  }, [isTopPage, page]);

  function getLinks() {
    const hasCursor = Boolean(cursor)
    setLoading(true)

    if(isTopPage){

      return firebase.db
      .collection('links')
      .orderBy('voteCount', 'desc')
      .limit(LINKS_PER_PAGE)
      .onSnapshot(handleSnapshot)

    } else if (page === 1) {

      return firebase.db
      .collection('links')
      .orderBy('created', 'desc')
      .limit(LINKS_PER_PAGE)
      .onSnapshot(handleSnapshot)

    } else if (hasCursor) {

      return firebase.db
      .collection('links')
      .orderBy('created', 'desc')
      .startAfter(cursor.created)
      .limit(LINKS_PER_PAGE)
      .onSnapshot(handleSnapshot)
    }
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    const lastLink = links[links.length -1]
    setLinks(links)
    setCursor(lastLink)
    setLoading(false)
  }

  /*function renderLinks() {
    if(IsNewPage) {
      return links
    }
    const topLinks = links.slice().sort((l1, l2) => l2.votes.length - l1.votes.length);
    return topLinks
  }*/

  function visitPreviousPage() {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`)
    }
  }

  function visitNextPage() {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 0;
  
  return (
    <div style={{ opacity: loading ? 0.25 : 1}}>
      {/* renderLinks() ao invés de usar links */}
      {links.map((link, index) => (
        <LinkItem key={link.id} showCount={true} link={link} index={index + pageIndex} />
      ))}
      {IsNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage} >Previous</div>
          <div className="pointer" onClick={visitNextPage} >Next</div>
        </div>
      )}
    </div>
  )
}

export default LinkList;
