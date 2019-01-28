import { ticTacToe } from "i-am-not-a-robot"
import * as pdsp from "pdsp"
import * as React from "react"
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
import PasswordField from "../components/PasswordField"

import PrivacyPolicy from "./PrivacyPolicy"
import TermsOfService from "./TermsOfService"

interface IProps {
}

interface IState {
  clientAgrees: boolean
  clientIsRobot: boolean
}

export default class CreateAccount extends React.Component<IProps, IState> {
  static path = "/create-account"

  state = {
    clientAgrees: false,
    clientIsRobot: true,
  }

  private antispamRef = React.createRef<HTMLInputElement>()
  private emailRef = React.createRef<HTMLInputElement>()
  private passwordRef = React.createRef<HTMLInputElement>()

  componentDidMount() {
    this.loadAntiSpam()
  }

  loadAntiSpam() {
    ticTacToe(this.antispamRef.current, () => {
      this.setState({ clientIsRobot: false })
    })
  }

  onChangeCheckbox = (event) => {
    this.setState({
      clientAgrees: event.target.checked
    })
  }

  onSubmit = (event) => {
    pdsp(event)
  }

  render() {
    const {
      clientAgrees,
      clientIsRobot
    } = this.state

    return (
      <Modal isActive>
        <Modal.Background />

        <Modal.Content>
          <Column>
            <Box>
              <Media>
                <Media.Left>
                  <Image is32x32 src="media/logo-32x32.png" />
                </Media.Left>

                <Media.Content>
                  <Content>
                    <Title is4 hasTextGrey>Create a Go7 account</Title>
                  </Content>
                </Media.Content>
              </Media>

              <Section
                isSrOnly={clientIsRobot && clientAgrees}
              >
                <form>
                  <EmailField
                    inputRef={this.emailRef}
                  />

                  <PasswordField
                    inputRef={this.passwordRef}
                  />

                  <Field>
                    <Control>
                      <Checkbox
                        onChange={this.onChangeCheckbox}
                      >
                        I agree to the <a href={PrivacyPolicy.path} target="_blank">Privacy Policy</a> and to the <a href={TermsOfService.path} target="_blank">Terms of Service</a>.
                      </Checkbox>
                    </Control>
                  </Field>

                  <Field>
                    <Control>
                      <Button
                        disabled={!clientAgrees}
                        isSuccess
                        isSrOnly={clientIsRobot}
                        onClick={this.onSubmit}
                      >
                        Create an account
                      </Button>
                    </Control>
                  </Field>
                </form>
              </Section>

              {clientIsRobot && (
                <Section
                  isSrOnly={!clientAgrees}
                >
                  <Message isMedium>
                    <Message.Header>
                      <p>
                        Are you a <strong>robot</strong>?
                      </p>
                    </Message.Header>

                    <Message.Body>
                      <p className="has-text-centered">
                        Play <em>tic tac toe</em> !
                      </p>

                      <div ref={this.antispamRef} />
                    </Message.Body>
                  </Message>
                </Section>
              )}
            </Box>
          </Column>
        </Modal.Content>
      </Modal>
    )
  }
}
