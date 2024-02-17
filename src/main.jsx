// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import { ConfirmProvider } from 'material-ui-confirm'



import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogProps : {maxWidth: 'xs'},
      cancellationButtonProps: {color: 'warning'},
      confirmationButtonProps: {color: 'secondary', variant: 'outlined'},
      buttonOrder: ['confirm', 'cancel']
    }}>
      <CssBaseline/>
      <App />
      <ToastContainer theme="colored"/>
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>
)
