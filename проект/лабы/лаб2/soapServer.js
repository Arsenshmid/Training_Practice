const soap = require('soap');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const { Client, Server, Entity } = require('./soapRepository');

// Добавляем модуль pg для подключения к базе данных PostgreSQL
const { Pool } = require('pg');

// Создаем подключение к базе данных
const pool = new Pool({
user: 'your_username',
host: 'localhost',
database: 'your_database_name',
password: 'your_password',
port: 5432,
});

// Создаем методы для чтения, создания, обновления и удаления записей
class Repository {
async read(id) {
const query = 'SELECT * FROM clients WHERE id = $1';
const values = [id];
const res = await pool.query(query, values);
return res.rows[0];
}

async create(entity) {
const query = 'INSERT INTO clients(name) VALUES($1) RETURNING id';
const values = [entity.name];
const res = await pool.query(query, values);
return res.rows[0].id;
}

async update(entity) {
const query = 'UPDATE clients SET name = $1 WHERE id = $2';
const values = [entity.name, entity.id];
const res = await pool.query(query, values);
return res.rowCount === 1;
}

async delete(id) {
const query = 'DELETE FROM clients WHERE id = $1';
const values = [id];
const res = await pool.query(query, values);
return res.rowCount === 1;
}
}

// Создаем экземпляр класса Repository
const repository = new Repository();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(xmlparser());

const wsdl = <definitions name="LabService" targetNamespace="http://www.examples.com/wsdl/LabService.wsdl" xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.examples.com/wsdl/LabService.wsdl" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">   <message name="readRequest">     <part name="id" type="xsd:int"/>   </message>   <message name="readResponse">     <part name="Result" type="tns:Entity"/>   </message>   <message name="createRequest">     <part name="Entity" type="tns:Entity"/>   </message>   <message name="createResponse">     <part name="Result" type="xsd:int"/>   </message>   <message name="updateRequest">     <part name="Entity" type="tns:Entity"/>   </message>   <message name="updateResponse">     <part name="Result" type="xsd:boolean"/>   </message>   <message name="deleteRequest">     <part name="id" type="xsd:int"/>   </message>   <message name="deleteResponse">     <part name="Result" type="xsd:boolean"/>   </message>   <portType name="LabService">     <operation name="read">       <input message="tns:readRequest"/>       <output message="tns:readResponse"/>     </operation>     <operation name="create">       <input message="tns:createRequest"/>       <output message="tns:createResponse"/>     </operation>     <operation name="update">       <input message="tns:updateRequest"/>       <output message="tns:updateResponse"/>     </operation>     <operation name="delete">       <input message="tns:deleteRequest"/>       <output message="tns:deleteResponse"/>     </operation>   </portType>   <binding name="LabServiceSoapBinding" type="tns:LabService">     <soap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>     <operation name="read">       <soap:operation soapAction="readAction"/>       <input>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </input>       <output>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </output>     </operation>     <operation name="create">       <soap:operation soapAction="createAction"/>       <input>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </input>       <output>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </output>     </operation>     <operation name="update">       <soap:operation soapAction="updateAction"/>       <input>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </input>       <output>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </output>     </operation>     <operation name="delete">       <soap:operation soapAction="deleteAction"/>       <input>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </input>       <output>         <soap:body use="encoded" namespace="urn:LabService" encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"/>       </output>     </operation>   </binding>   <service name="LabServiceService">     <port name="LabService" binding="tns:LabServiceSoapBinding">       <soap:address location="http://localhost:8000/wsdl"/>     </port>   </service> </definitions>;
const service = {
    LabService: {
    LabServiceSoapPort: {
    read(args, callback) {
    const id = args.id;
    repository.read(id)
    .then((entity) => {
    if (entity) {
    callback(null, { Result: entity });
    } else {
    callback('Entity not found');
    }
    })
    .catch((err) => {
    callback(err);
    });
    },
    create(args, callback) {
    const entity = args.Entity;
    repository.create(entity)
    .then((id) => {
    callback(null, { Result: id });
    })
    .catch((err) => {
    callback(err);
    });
    },
    update(args, callback) {
    const entity = args.Entity;
    repository.update(entity)
    .then((result) => {
    if (result) {
    callback(null, { Result: true });
    } else {
    callback('Entity not found');
    }
    })
    .catch((err) => {
    callback(err);
    });
    },
    delete(args, callback) {
    const id = args.id;
    repository.delete(id)
    .then((result) => {
    if (result) {
    callback(null, { Result: true });
    } else {
    callback('Entity not found');
    }
    })
    .catch((err) => {
    callback(err);
    });
    },
    },
    },
    };
    
    // Создаем объект SOAP-сервера и передаем ему объект сервиса
    const server = soap.listen(app, '/wsdl', service, wsdl);
    
    // Запускаем сервер на порту 8000
    app.listen(8000, () => {
    console.log('Listening on port 8000');
    });