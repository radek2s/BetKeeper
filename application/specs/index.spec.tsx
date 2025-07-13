import { render } from '@testing-library/react'
import { SimpleComponsnet } from '../src/lib/Component'

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SimpleComponsnet/>)
    expect(baseElement).toBeTruthy()
  })
})
