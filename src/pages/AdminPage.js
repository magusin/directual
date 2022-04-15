import React, { useState } from 'react'
import Directual from 'directual-api'
import { useAuth } from '../auth'
import { Loader } from '../components/loader/loader'

// Example of posting data to Directual

// Connect to Directual api
const api = new Directual({ apiHost: '/' })

export default function AdminPage() {
  // API-endpoint details
  const dataStructure = 'product' // todo: write here sysname of your data structure
  const endpoint = 'postProduct' // todo: write here Method name of your API-endpoint

  // Connect authentication context
  const auth = useAuth()

  // Hooks for handling state
  const [response, setResponse] = useState() // API response
  const [status, setStatus] = useState() // Request status
  const [badRequest, setBadRequest] = useState() // API error message
  const [loading, setLoading] = useState(false) // Loader
  const [showForm, setShowForm] = useState(true) // Show/hide the form
  const [formPayload, setFormPayload] = useState({}) // Data to send. Here we can add userID: auth.user by default

  // Reset the form
  const resetForm = () => {
    setResponse()
    setStatus()
    setBadRequest()
    setShowForm(true)
    setFormPayload({ userID: auth.user }) // Don't forget to include userID: auth.user, if needed
  }

  // POST-request
  function postData() {
    setLoading(true)
    setShowForm(false)
    api
      // Data structure
      .structure(dataStructure)
      // POST request + payload + query params:
      .setData(endpoint, formPayload, { sessionID: auth.sessionID })
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

  function postData2() {
    //    var data = new FormData();
    //    var imagedata = document.querySelector('input[type="file"]').files[0];
    //    data.append("data", imagedata);
    //    fetch(`https://api.directual.com/good/api/v5/data/product/postProduct?appID=445e7531-8fc5-44ad-9402-2668a9bf7365&sessionID=${auth.sessionID}`, {
    //      mode: 'no-cors',
    //      method: "POST",
    //      headers: {
    //       'Content-Type': 'multipart/form-data; charset=utf-8; boundary=__X_PAW_BOUNDARY__'
    //   }
    //    }).then(function (res) {
    //      if (res.ok) {
    //        alert("Perfect! ");
    //      } else if (res.status === 401) {
    //        alert("Oops! ");
    //      }
    //    }, function (e) {
    //      alert("Error submitting form!");
    //    });
    //  }
    setLoading(true)
    setShowForm(false)
    fetch(
      `http://localhost:3000/good/api/v5/data/product/postProduct?apiHost=%2F&sessionID=${auth.sessionID}`,
      {
        method: 'POST',
        body: JSON.stringify({ company: formPayload.company, title: formPayload.title, description: formPayload.description, file: formPayload.file }),
        headers: {
          'Content-Type':
            'multipart/form-data; charset=utf-8; boundary=__X_PAW_BOUNDARY__'
        }
      }
    ).then((response) => {
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

  return (
    <div className="content">
      <h1>Example of posting data</h1>
      {loading && <Loader />}
      {showForm && (
        <form onSubmit={postData2} >
          <input
            type="text"
            placeholder="Titre"
            onChange={(e) => {
              setFormPayload({ ...formPayload, title: e.target.value })
            }}
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => {
              setFormPayload({ ...formPayload, description: e.target.value })
            }}
          />
          <input
            type="text"
            placeholder="Company"
            onChange={(e) => {
              setFormPayload({ ...formPayload, company: e.target.value })
            }}
          />
          <input
            type="file"
            placeholder="File"
            onChange={(e) => {
              setFormPayload({ ...formPayload, file: e.target.value })
            }}
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {/* Everything is OK */}
      {response && (
        <div>
          <b>Submitted successfully</b>
          <p>
            Response: <code>{JSON.stringify(response)}</code>
          </p>
          {status && (
            <p>
              Status: <code>{JSON.stringify(status)}</code>
            </p>
          )}
        </div>
      )}

      {/* Something went wrong */}
      {badRequest && (
        <div class="error">
          <b>{badRequest.httpCode} error</b>
          {badRequest.httpCode === '400' && (
            <p>API-endpoint is not configured properly.</p>
          )}
          {badRequest.httpCode === '403' && (
            <p>You have to be logged in to submit this form.</p>
          )}
          <p>
            <code>{badRequest.msg}</code>
          </p>
        </div>
      )}

      {/* Reset the form */}
      {!showForm && !loading && (
        <button onClick={resetForm}>Submit again</button>
      )}
    </div>
  )
}
