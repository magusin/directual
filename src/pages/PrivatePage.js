import React, { useEffect, useState } from 'react'
import Directual from 'directual-api'
import { useAuth } from '../auth'
import { Loader } from '../components/loader/loader'
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Container
} from 'reactstrap'

// Example of getting data from Directual

// Connect to Directual api
const api = new Directual({ apiHost: '/' })

export default function PrivatePage () {
    // API-endpoint details
    const dataStructure = 'product' // todo: write here sysname of your data structure
    const endpoint = 'profileProduct' // todo: write here Method name of your API-endpoint

    // connect authentication context
    const auth = useAuth()
  
    // Hooks for handling state
    const [payload, setPayload] = useState([]) // API response
    const [pageInfo, setPageInfo] = useState({}) // API response metadata, e.g. number of objects
    const [loading, setLoading] = useState(true) // initial loader
    const [badRequest, setBadRequest] = useState() // API error message
    const [pageSize] = useState(5) // Page size, bu default = 10
  
     // Paging
  useEffect(() => {
    
    getData()
    // eslint-disable-next-line
  }, [])
   
  // GET-request
  function getData() {
    api
      // Data structure
      .structure(dataStructure)
      // GET request + query params (sessionID, page, pageSize by default)
      .getData(endpoint, {
        sessionID: auth.sessionID,
        pageSize: pageSize
      })
      // other possible query params:
      // {{HttpRequest}} — any param for Filtering
      // sort=FIELD_SYSNAME_1,desc,FIELD_SYSNAME_2,asc — sorting with multiple params
      .then((response) => {
        setPayload(response.payload)
        setPageInfo(response.pageInfo)
        setLoading(false)
      })
      .catch((e) => {
        // handling errors
        setLoading(false)
        console.log(e.response)
        setBadRequest(e.response.status + ', ' + e.response.data.msg)
      })
  }
  return (
    <div className="content">
    {loading && <Loader />}
    {payload && !loading && (
      <div>
        {/* API response */}
        <div className="request-info">
          <span>Data structure: <b>{dataStructure ? dataStructure : <span className="error">not provided</span>}</b></span>
          <span>API-endpoint: <b>{endpoint ? endpoint : <span className="error">not provided</span>}</b></span>
          <span>Payload: <code>{JSON.stringify(payload)}</code></span>
          <span>Payload info: <code>{JSON.stringify(pageInfo)}</code></span>
          {badRequest && <code className="error">Error: <b>{badRequest}</b></code>}
        </div>
        <Container>
          {payload.map((data) => (
            <Card
              className="border-1 border-primary text-center mb-2 "
              key={data.id}
            >
              <CardHeader>
                <CardTitle>
                  <h3>{data.title}</h3>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {/* <img alt='none' src={data.file} className='image'></img> */}
                <CardText>
                  <p>{data.description}</p>
                </CardText>
                <p>{data.company}</p>
              </CardBody>
            </Card>
          ))}
        </Container>
      </div>
    )}
  </div>
  )
}