export default function CodeTaken({ code }) {
    if (!code) return null;

    return (
        <div className="card mt-4 w-50 mx-auto shadow-sm">
            <div className="card-body text-center">
                <h3 className="card-title mb-3 text-danger">
                    Código já está em uso
                </h3>

                <p className="mb-2">
                    O código <strong>{code}</strong> já foi escolhido por outro usuário.
                </p>

                <p className="text-muted">
                    Tente escolher outro código.
                </p>

                <button
                    className="btn btn-primary mt-3"
                    onClick={() => window.location.reload()}
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
