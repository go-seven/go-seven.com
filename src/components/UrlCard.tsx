import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import {
  Button,
  Buttons,
  Card,
  Control,
  Delete,
  Field,
  Icon,
  Input,
  Label,
  Modal,
  Notification,
  Tag,
} from "trunx"

export interface IUrlCardProps {
  removeUrl: () => void
  removingUrl: boolean
  url
}

interface IState {
  askingRemovalConfirmation: boolean
  editingUrl: boolean
  highlighted: boolean
}

export default class UrlCard extends React.Component<IUrlCardProps, IState> {
  state: IState = {
    askingRemovalConfirmation: false,
    editingUrl: false,
    highlighted: false,
  }

  askUrlRemovalConfirmation = () => {
    this.setState({
      askingRemovalConfirmation: true,
      editingUrl: false,
    })
  }

  closeUrlEditor = () => {
    this.setState({
      askingRemovalConfirmation: false,
      editingUrl: false,
    })
  }

  onClickRemoveUrl = () => {
    this.setState({
      askingRemovalConfirmation: false,
      editingUrl: false,
    }, () => {
      this.props.removeUrl()
    })
  }

  onClickEdit = () => {
    this.setState({
      askingRemovalConfirmation: false,
      editingUrl: true,
    })
  }

  onClickCard = () => {
    this.setState({
      askingRemovalConfirmation: false,
      editingUrl: true,
      highlighted: false,
    })
  }

  onClickLink = (event) => {
    event.stopPropagation()
  }

  onMouseEnterCard = () => {
    this.setState({
      highlighted: true
    })
  }

  onMouseLeaveCard = () => {
    this.setState({
      highlighted: false
    })
  }

  render() {
    const {
      removingUrl,
      url,
    } = this.props

    const {
      askingRemovalConfirmation,
      editingUrl,
      highlighted,
    } = this.state

    return (
      <>
        {askingRemovalConfirmation && (
          <Modal isActive>
            <Modal.Background onClick={this.closeUrlEditor} />

            <Notification isWarning>
              Are you sure you want to remove it?
            </Notification>

            <Buttons>
              <Button onClick={this.closeUrlEditor}>
                Cancel
              </Button>

              <Button
                isDanger
                isOutlined
                onClick={this.onClickRemoveUrl}
              >
                Remove
              </Button>
            </Buttons>
          </Modal>
        )}

        {editingUrl && (
          <Modal isActive>
            <Modal.Background onClick={this.closeUrlEditor} />

            <Modal.Card>
              <Modal.Card.Head>
                <Modal.Card.Title>
                  <Tag isLink >{url.id}</Tag>
                </Modal.Card.Title>

                <Delete onClick={this.closeUrlEditor}/>
              </Modal.Card.Head>
              <Modal.Card.Body>
                <Field>
                  <Label>
                    Title
                  </Label>

                  <Control>
                    <Input
                      readOnly
                      type="text"
                      value={url.title}
                    />
                  </Control>
                </Field>

              </Modal.Card.Body>

              <Modal.Card.Foot>
                <Button
                  isDanger
                  onClick={this.askUrlRemovalConfirmation}
                >
                  Remove
                </Button>

                <Button
                  onClick={this.closeUrlEditor}
                >
                  Cancel
                </Button>

                <Button isPrimary>
                  Save
                </Button>

              </Modal.Card.Foot>
            </Modal.Card>
          </Modal>
        )}

        <Card
          onClick={this.onClickCard}
          onMouseEnter={this.onMouseEnterCard}
          onMouseLeave={this.onMouseLeaveCard}
        >
          <Card.Header>
            <Card.Header.Title>
              <Tag
                href={url.href}
                isLink={!removingUrl}
                isWarning={removingUrl}
                onClick={this.onClickLink}
                target="_blank"
              >
                {url.id}
              </Tag>
            </Card.Header.Title>

            <Card.Header.Icon>
              {removingUrl ? (null) : (
                highlighted && (
                  <Icon onClick={this.onClickEdit}>
                    <Icon.Svg
                      icon={solidIcon.edit}
                    />
                  </Icon>
                )
              )}
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
