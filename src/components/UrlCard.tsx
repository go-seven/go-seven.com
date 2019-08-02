import * as solidIcon from "fa-svg-icon/solid"
import * as React from "react"
import {
  Box,
  Button,
  Buttons,
  Card,
  Column,
  Control,
  Field,
  Icon,
  Input,
  Label,
  Modal,
  Notification,
  Tag,
} from "trunx"

import {
  IUrl
} from "../reducers/urlCollections"

export interface IUrlCardProps {
  removeUrl: () => void
  removingUrl: boolean
  url: IUrl
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

  closeRemovalConfirmation = () => {
    this.setState({
      askingRemovalConfirmation: false,
      editingUrl: true,
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

            <Modal.Close
              isLarge
              onClick={this.closeRemovalConfirmation}
            />

            <Modal.Content>
              <Column>
                <Notification isDanger>
                  Are you sure you want to delete this URL?
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
                    Yes, delete it
                  </Button>
                </Buttons>
              </Column>
            </Modal.Content>
          </Modal>
        )}

        {editingUrl && (
          <Modal isActive>
            <Modal.Background onClick={this.closeUrlEditor} />

            <Modal.Close
              isLarge
              onClick={this.closeUrlEditor}
            />

            <Modal.Content>
              <Column>
                <Box>
                  <form>
                    <Field>
                      <Control>
                        <Tag isLink >{url.id}</Tag>
                      </Control>
                    </Field>

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
                  </form>
                </Box>

                <Button
                  isDanger
                  isOutlined
                  onClick={this.askUrlRemovalConfirmation}
                >
                  Delete URL
                </Button>
              </Column>
            </Modal.Content>
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
