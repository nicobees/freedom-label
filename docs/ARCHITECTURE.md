# Architecture Diagram

This section will contain the C4 model diagram of the system.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(user, "User", "Uses the Freedom Label application")

System_Boundary(c1, "Freedom Label System") {
    Container(frontend, "Frontend", "React, Vite, TypeScript", "Provides the user interface for label printing")
    Container(backend, "Backend", "FastAPI, Python", "Provides the API for label printing and other services")
    Container(database, "Database", "PostgreSQL", "Stores application data")
}

Rel(user, frontend, "Uses")
Rel(frontend, backend, "Makes API calls to")
Rel(backend, database, "Reads from and writes to")

@enduml
```