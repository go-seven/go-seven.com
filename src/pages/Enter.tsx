import * as pdsp from "pdsp"
import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {
  Box,
  Button,
  Checkbox,
  Column,
  Content,
  Control,
  Field,
  Image,
  Media,
  Message,
  Modal,
  Section,
  Title,
} from "trunx"

import EmailField from "../components/EmailField"
import Logo from "../components/Logo"
import PasswordField from "../components/PasswordField"

import * as apiError from "../apiErrors"

import {
  enter,
  IAuthentication,
  ICredentials,
} from "../reducers/account"

import CreateUrl from "./CreateUrl"
import Homepage from "./Homepage"

interface IProps {
  authentication: IAuthentication
  enter: (ICredentials) => void
  isEnteringAccount: boolean
}

interface IState {
  redirect?: string
}

class Enter extends React.Component<IProps, IState> {
  static path = "/enter"

  state: IState = {}

  private emailRef = React.createRef<HTMLInputElement>()
  private passwordRef = React.createRef<HTMLInputElement>()

  onSubmit = (event) => {
    pdsp(event)

    const email = this.emailRef.current && this.emailRef.current.value
    const password = this.passwordRef.current && this.passwordRef.current.value

    this.props.enter({ email, password })
  }

  render() {
    const {
      authentication,
      isEnteringAccount,
    } = this.props

    if (authentication === null) {
      return null
    }

    if (authentication.isValid) {
      return (
        <Redirect push to={CreateUrl.path} />
      )
    }

    const error = authentication.error || { code: "", message: "" }
    const emailFieldError = error.code === apiError.AccountNotFoundError ? error.message : undefined
    const passwordFieldError = error.code === apiError.InvalidPasswordError ? error.message : undefined

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            <Box>
              <Media>
                <Media.Left>
                  <Logo />
                </Media.Left>

                <Media.Content>
                  <Content hasTextCentered>
                    <Title is4 hasTextGrey>Enter GoSeven</Title>
                  </Content>
                </Media.Content>
              </Media>

              <form
                autoComplete="on"
                onSubmit={this.onSubmit}
              >
                <EmailField
                  errorMessage={emailFieldError}
                  inputRef={this.emailRef}
                />

                <PasswordField
                  errorMessage={passwordFieldError}
                  inputRef={this.passwordRef}
                />

                <Field>
                  <Control>
                    <Button
                      isLoading={isEnteringAccount}
                      isSuccess
                      type="submit"
                      value="Enter"
                    />
                  </Control>
                </Field>
              </form>
            </Box>

            {error.code === apiError.AccountNotVerifiedError && (
              <Message>
                Account not verified.
              </Message>
            )}
          </Column>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  authentication: state.account.authentication,
  isEnteringAccount: state.account.isEntering
})

const mapDispatchToProps = (dispatch) => ({
  enter: (credentials) => dispatch(enter(credentials))
})

export default connect(mapStateToProps, mapDispatchToProps)(Enter)
