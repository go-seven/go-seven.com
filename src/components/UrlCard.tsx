import * as React from "react"
import {
  Button,
  Card,
  Column,
  Delete,
  Modal,
  Notification,
  Tag,
} from "trunx"

export interface IUrlCardProps {
  deleteUrl: (id: string) => void
  url
}

interface IState {
  askingConfirmationForUrlDeletion: boolean
}

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    askingConfirmationForUrlDeletion: false
  }

  askConfirmationForUrlDeletion = () => {
    this.setState({ askingConfirmationForUrlDeletion: true })
  }

  confirmUrlDeletion = () => {
    const {
      deleteUrl,
      url
      } = this.props

    this.setState(
      { askingConfirmationForUrlDeletion: false },
      () => { deleteUrl(url.id) }
    )
  }

  dismissUrlDeletion = () => {
    this.setState({ askingConfirmationForUrlDeletion: false })
  }

  render() {
    const {
      url,
    } = this.props

    const {
      askingConfirmationForUrlDeletion
    } = this.state

    return (
      <>
        {askingConfirmationForUrlDeletion && (
          <Modal isActive>
            <Modal.Background onClick={this.dismissUrlDeletion} />

            <Modal.Content>
              <Column isCentered>
                <Notification>
                  Are you sure you want to <strong>delete</strong> this?

                  <br />

                  <a href={url.href} target="_blank">{url.title}</a>
                </Notification>

                <Button isDanger isOutlined onClick={this.askConfirmationForUrlDeletion}>Delete</Button>
              </Column>
            </Modal.Content>

            <Modal.Close isLarge onClick={this.dismissUrlDeletion} />
          </Modal>
        )}

        <Card>
          <Card.Header>
            <Card.Header.Title>
              <Tag
                href={url.href}
                isLink
                target="_blank"
              >
                {url.id}
              </Tag>
            </Card.Header.Title>

            <Card.Header.Icon>
              <Delete onClick={this.askConfirmationForUrlDeletion} />
            </Card.Header.Icon>
          </Card.Header>

          <Card.Content>
            <span>
              {url.title}
            </span>
          </Card.Content>
        </Card>
      </>
    )
  }
}
