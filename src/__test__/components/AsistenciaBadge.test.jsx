import { render, screen } from '@testing-library/react'
import AsistenciaBadge from '../../components/AsistenciaBadge'

//Ese test verifica que el componente AsistenciaBadge muestre correctamente el texto que recibe como prop estado
describe('AsistenciaBadge', () => {
  it('muestra el texto del estado recibido', () => {
    render(<AsistenciaBadge estado="Presente" />)
    expect(screen.getByText('Presente')).toBeInTheDocument()
  })
})