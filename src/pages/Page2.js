import React, { useEffect, useState, Checkbox } from 'react'
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
import { useParams } from 'react-router-dom'

// Example of getting data from Directual

// Connect to Directual api
const api = new Directual({ apiHost: '/' })

const Page2 = () => {
  const { id } = useParams()
  // API-endpoint details
  const dataStructure = 'product' // todo: write here sysname of your data structure
  const endpoint = 'getProduct' // todo: write here Method name of your API-endpoint
  console.log(useParams())
  // connect authentication context
  const auth = useAuth()

  // Hooks for handling state
  const [payload, setPayload] = useState([]) // API response
  const [pageInfo, setPageInfo] = useState({}) // API response metadata, e.g. number of objects
  const [loading, setLoading] = useState(true) // initial loader
  const [badRequest, setBadRequest] = useState() // API error message
  const [pageSize] = useState(2) // Page size, bu default = 10
  const [formPayload, setFormPayload] = useState({}) // Data to send. Here we can add userID: auth.user by default
  const [response, setResponse] = useState() // API response
  const [status, setStatus] = useState() // Request status
  const [showForm, setShowForm] = useState(true) // Show/hide the form

  // Paging
  useEffect(() => {
    getData(id)
    // eslint-disable-next-line
  }, [])

  // GET-request
  function getData(id) {
    api
      // Data structure
      .structure(dataStructure)
      // GET request + query params (sessionID, page, pageSize by default)
      .getData(endpoint, {
        sessionID: auth.sessionID,
        pageSize: pageSize,
        id: id
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
  console.log(payload)
  // POST-request
  function postData() {
    setLoading(true)
    setShowForm(false)
    api
      // Data structure
      .structure(dataStructure)
      // POST request + payload + query params:
      .setData(endpoint, formPayload, {
        sessionID: auth.sessionID,
        id: payload.id
      })
      .then((response) => {
        setResponse(response.result)
        setStatus(response.status)
        setLoading(false)
      })
      .catch((e) => {
        // handling errors
        setLoading(false)
        console.log(e.response)
        setBadRequest({
          httpCode: e.response.status,
          msg: e.response.data.msg
        })
      })
  }

  function update(e) {
    e.preventDefault()
    let fetchData = fetch(
      `https://api.directual.com/good/api/v5/data/product/getProduct?appID=445e7531-8fc5-44ad-9402-2668a9bf7365&id=35ceda16-d830-4cf0-80c5-cad845aa6ed0`,
      {
        method: 'POST',
        body: JSON.stringify({
          is_selected: true,
          id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      getData(id)
    })
    console.log(fetchData)
  }
  return (
    <div className="content">
      {loading && <Loader />}
      {payload && !loading && (
        <div>
          {/* API response */}
          <div className="request-info">
            <span>
              Data structure:{' '}
              <b>
                {dataStructure ? (
                  dataStructure
                ) : (
                  <span className="error">not provided</span>
                )}
              </b>
            </span>
            <span>
              API-endpoint:{' '}
              <b>
                {endpoint ? (
                  endpoint
                ) : (
                  <span className="error">not provided</span>
                )}
              </b>
            </span>
            <span>
              Payload: <code>{JSON.stringify(payload)}</code>
            </span>
            <span>
              Payload info: <code>{JSON.stringify(pageInfo)}</code>
            </span>
            {badRequest && (
              <code className="error">
                Error: <b>{badRequest}</b>
              </code>
            )}
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
                  <img alt="none" src={data.file} className="image"></img>
                  <CardText>
                  {data.description}
                    {data.company}
                    <br />
                    IS_SELECTED : {data.is_selected ? "TRUE" : "FALSE"}
                  </CardText>
                 
                </CardBody>
                {showForm && (
                  <form>
                    <button
                      onClick={(e) => {
                        update(e)
                      }}
                      type="submit"
                    >
                      Ajouter à mon profil{' '}
                    </button>
                  </form>
                )}
              </Card>
            ))}
          </Container>
        </div>
      )}
    </div>
  )
}

export default Page2
