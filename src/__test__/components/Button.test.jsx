import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../components/Button'
//este test prueba el comportamiento del boton dentro de la pagina
describe('Button', () => {
  it('renderiza el texto que recibe como children', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument()
  })

  it('llama a onClick cuando se hace click', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Guardar</Button>)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('se deshabilita cuando recibe disabled', () => {
    render(<Button disabled>Guardar</Button>)
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled()
  })

  it('no llama a onClick si está disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Guardar</Button>)

    await user.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(handleClick).not.toHaveBeenCalled()
  })
})