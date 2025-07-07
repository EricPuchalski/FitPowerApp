import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, Edit2, Trash2, Calendar, FileText, User, Clock, Target, Activity, List } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Card, Button, Badge, Container, Row, Col, Spinner } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { NutritionistHeader } from "../../components/NutritionistHeader"
import { useAuth } from "../../auth/hook/useAuth"
import { FooterPag } from "../../components/Footer"

interface NutritionPlan {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  caloricTarget: number;
  dailyCarbs: number;
  dailyProteins: number;
  dailyFats: number;
  recommendations: string;
  active: boolean;
  nutritionistId: number;
  nutritionistName: string;
  clientDni: string;
  clientName: string;
}

interface Client {
  id: number;
  name: string;
  lastName: string;
  dni: string;
  phoneNumber: string;
  address: string;
  email: string;
  goal: string;
  initialPhysicalCondition: string;
  gymName: string;
  active: boolean;
}

export default function DashboardNutritionistPlans() {
  const { clientDni } = useParams<{ clientDni: string }>()
  const [activePlan, setActivePlan] = useState<NutritionPlan | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState({
    client: true,
    plan: true
  })
  const navigate = useNavigate()
  const { logout } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem("token")
    
    // Función para buscar los datos del cliente
    const fetchClientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 404) {
          setClient(null)
        } else if (!response.ok) {
          throw new Error("Error al obtener los datos del cliente")
        } else {
          const clientData: Client = await response.json()
          setClient(clientData)
        }
      } catch (error) {
        console.error("Error fetching client data:", error)
        toast.error("Error al cargar los datos del cliente")
      } finally {
        setLoading(prev => ({ ...prev, client: false }))
      }
    }

    // Función para buscar el plan activo
    const fetchActivePlan = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 404) {
          setActivePlan(null)
        } else if (!response.ok) {
          throw new Error("Error al obtener el plan activo")
        } else {
          const planData: NutritionPlan = await response.json()
          setActivePlan(planData)
        }
      } catch (error) {
        console.error("Error fetching active plan:", error)
        toast.error("Error al cargar el plan nutricional activo")
      } finally {
        setLoading(prev => ({ ...prev, plan: false }))
      }
    }

    // Ejecutar ambas búsquedas
    fetchClientData()
    fetchActivePlan()
  }, [clientDni])

  const deletePlan = async (planId: number) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este plan?")
    if (!confirmed) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      
      if (!response.ok) {
        throw new Error("Error al eliminar el plan")
      }
      
      setActivePlan(null)
      toast.success("Plan eliminado correctamente")
    } catch (error) {
      console.error(error)
      toast.error("Error al eliminar el plan")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysActive = (createdAt: string) => {
    const today = new Date()
    const created = new Date(createdAt)
    const diffTime = today.getTime() - created.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (loading.client || loading.plan) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <div>
                <Spinner animation="border" variant="primary" className="mb-3" />
                <p className="text-muted">Cargando datos del cliente...</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  if (!client) {
    return (
      <Container className="py-5">
        <Row>
          <Col className="text-center">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
              <div>
                <h3 className="h4 fw-semibold text-dark mb-2">Cliente no encontrado</h3>
                <p className="text-muted mb-4">
                  No se encontró un cliente con el DNI: {clientDni}
                </p>
                <Button
                  onClick={() => navigate("/nutritionist/clients")}
                  variant="primary"
                  style={{ backgroundColor: "#e91e63", borderColor: "#e91e63" }}
                >
                  Volver a la lista de clientes
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <>
      <NutritionistHeader onLogout={handleLogout} />
      
      <Container className="py-5">
        {/* Header */}
        <div className="mb-5">
<Row className="align-items-center mb-4">
  <Col xs="auto">
    <Button
      onClick={() => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/new/edit`)}
      variant="primary"
      style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
    >
      <Plus className="me-2" size={16} />
      Nuevo Plan
    </Button>
    <Button
      onClick={() => navigate(`/nutritionist/client/${clientDni}/history`)}
      variant="secondary"
      style={{ backgroundColor: "#2196F3", borderColor: "#2196F3", marginLeft: "10px" }}
    >
      <List className="me-2" size={16} />
      Ver Historial
    </Button>
  </Col>
</Row>


          <div className="text-center">
            <h1 className="display-5 fw-bold text-dark mb-3">Plan Nutricional Activo</h1>
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center text-muted gap-3">
              <div className="d-flex align-items-center">
                <User className="me-2" size={16} />
                <span className="fs-5">Cliente: {client.name} {client.lastName} (DNI: {client.dni})</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="fs-5">Objetivo: {client.goal}</span>
              </div>
            </div>
            {client.initialPhysicalCondition && (
              <div className="mt-3">
                <h4 className="h5 fw-semibold">Estado Físico Inicial</h4>
                <p className="text-muted">{client.initialPhysicalCondition}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {!activePlan ? (
          <Card className="text-center p-5">
            <Card.Body>
              <div className="mb-4">
                <div 
                  className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center mb-4"
                  style={{ width: "96px", height: "96px" }}
                >
                  <FileText className="text-muted" size={48} />
                </div>
                <h3 className="h4 fw-semibold text-dark mb-2">No hay plan activo</h3>
                <p className="text-muted mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
                  Este cliente no tiene un plan nutricional activo en este momento. Crea uno nuevo para comenzar su
                  seguimiento nutricional.
                </p>
                <Button
                  onClick={() => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/new/edit`)}
                  variant="primary"
                  style={{ backgroundColor: "#e91e63", borderColor: "#e91e63" }}
                >
                  <Plus className="me-2" size={16} />
                  Crear Primer Plan
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card key={activePlan.id} className="overflow-hidden border-start border-5" style={{ borderLeftColor: "#e91e63" }}>
            <Card.Header style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)" }}>
              <Row className="align-items-start">
                <Col>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <Card.Title className="h3 text-dark mb-0">{activePlan.name}</Card.Title>
                    <Badge bg={activePlan.active ? "success" : "secondary"}>
                      {activePlan.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <Card.Text className="text-dark mb-2">
                    {activePlan.recommendations || "Sin recomendaciones disponibles"}
                  </Card.Text>
                  <div className="d-flex gap-3 text-muted small">
                    <span>📊 Meta calórica: {activePlan.caloricTarget} kcal</span>
                    <span>👨‍⚕️ Nutricionista: {activePlan.nutritionistName}</span>
                  </div>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="pt-4">
              {/* Macronutrientes */}
              <Row className="g-4 mb-4">
                <Col md={3}>
                  <div className="d-flex align-items-center p-3 bg-primary bg-opacity-10 rounded">
                    <div className="me-3">
                      <Target className="text-primary" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-primary mb-1">Objetivo Calórico</p>
                      <p className="fs-6 fw-semibold text-primary mb-0">{activePlan.caloricTarget} kcal</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-center p-3 bg-success bg-opacity-10 rounded">
                    <div className="me-3">
                      <Activity className="text-success" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-success mb-1">Carbohidratos</p>
                      <p className="fs-6 fw-semibold text-success mb-0">{activePlan.dailyCarbs}g</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-center p-3 bg-warning bg-opacity-10 rounded">
                    <div className="me-3">
                      <Activity className="text-warning" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-warning mb-1">Proteínas</p>
                      <p className="fs-6 fw-semibold text-warning mb-0">{activePlan.dailyProteins}g</p>
                    </div>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-center p-3 bg-info bg-opacity-10 rounded">
                    <div className="me-3">
                      <Activity className="text-info" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-info mb-1">Grasas</p>
                      <p className="fs-6 fw-semibold text-info mb-0">{activePlan.dailyFats}g</p>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Información adicional */}
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <div className="d-flex align-items-center p-3 bg-secondary bg-opacity-10 rounded">
                    <div className="me-3">
                      <Calendar className="text-secondary" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-secondary mb-1">Fecha de Creación</p>
                      <p className="fs-6 fw-semibold text-secondary mb-0">{formatDate(activePlan.createdAt)}</p>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="d-flex align-items-center p-3 bg-dark bg-opacity-10 rounded">
                    <div className="me-3">
                      <Clock className="text-dark" size={24} />
                    </div>
                    <div>
                      <p className="small fw-medium text-dark mb-1">Días Activo</p>
                      <p className="fs-6 fw-semibold text-dark mb-0">
                        {getDaysActive(activePlan.createdAt) > 0 
                          ? `${getDaysActive(activePlan.createdAt)} días` 
                          : "Recién creado"}
                      </p>
                    </div>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              {/* Acciones Rápidas */}
              <div className="d-flex flex-wrap gap-3">
                <Button
                  onClick={() => navigate(`/nutritionist/client/${clientDni}/nutrition-plans/${activePlan.id}/edit`)}
                  variant="primary"
                >
                  <Edit2 className="me-2" size={16} />
                  Editar Plan
                </Button>

                <Button
                  variant="outline-danger"
                  onClick={() => deletePlan(activePlan.id)}
                >
                  <Trash2 className="me-2" size={16} />
                  Eliminar Plan
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
      
      <FooterPag />
    </>
  )
}