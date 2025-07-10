import { render } from "@testing-library/react"
import Page from "../src/app/page"


describe('RootPage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Page/>)
    expect(baseElement).toBeTruthy()
  })
})
