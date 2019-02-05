import * as React from "react"
import {
  Button,
  Control,
  Field,
  Hero,
  Input
} from "trunx"

export default class UrlCreator extends React.Component {
  render() {
    return (
      <Hero isPrimary>
        <Hero.Body>
          <Field>
            <Control>
              <Input
                placeholder="Paste or write your URL here"
                type="text"
              />
            </Control>

            <Field>
              <Control>
                <Button
                  disabled
                >
                  Save
                </Button>
              </Control>
            </Field>
          </Field>
        </Hero.Body>
      </Hero>
    )
  }
}
