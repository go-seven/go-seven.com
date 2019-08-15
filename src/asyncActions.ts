/** Redux helper */
export default function asyncActions (NAME: string) {
  return {
    FAILURE: `${NAME}_FAILURE`,
    REQUEST: `${NAME}_REQUEST`,
    SUCCESS: `${NAME}_SUCCESS`
  }
}
