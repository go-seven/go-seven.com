import * as React from "react"
import { FormattedMessage } from "react-intl"
import {
  B,
  P,
} from "trunx"

export default function PleaseLookForVerificationEmail() {
  return (
    <P>
      <FormattedMessage id={"PleaseLookForVerificationEmail.message"} />

      &nbsp;

      <B hasTextSuccess>
        <FormattedMessage id={"PleaseLookForVerificationEmail.email-verification"} />.
      </B>
    </P>
  )
}
