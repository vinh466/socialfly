import { Link } from "react-router-dom"

interface PropTypes {
    product: {
        _id: string
        name: string
    }
}

function CardTemplate({ product }: PropTypes) {
    return (
        <div className="card ...">
            <span className="product_name">{product.name}</span>

            <Link to={'/product/' + product._id}>Chi Tiết</Link>
        </div>
    )
}

export default CardTemplate