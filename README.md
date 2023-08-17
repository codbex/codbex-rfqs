# codbex-rfqs
RFQs Management Application

### Model

![model](images/rfqs-model.png)

### Application

#### Launchpad

![launchpad](images/rfqs-launchpad.png)

#### Management

![request](images/rfqs-request.png)

![quotation](images/rfqs-quotation.png)


### Infrastructure

#### Build

	docker build -t codbex-rfqs:1.0.0 .

#### Run

	docker run --name codbex-rfqs -d -p 8080:8080 codbex-rfqs:1.0.0

#### Clean

	docker rm codbex-rfqs