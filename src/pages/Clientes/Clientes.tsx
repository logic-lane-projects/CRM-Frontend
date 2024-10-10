import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
  } from '@shopify/polaris';
  import React from 'react';


export default function Clientes() {  
  function SimpleIndexTableExample() {
    const orders = [
      {
        id: '1020',
        nombre: 'Francisco',
        apellido: 'López',
        correo: 'frcrm@gmail.com',
        telefono: '5587961224',
        ciudad: 'Guadalajara',
        rol: 'Vendedor',
      },
      {
        id: '1019',
        nombre: 'Rodrigo',
        apellido: 'Gutierrez',
        correo: 'rocrm@gmail.com',
        telefono: '5682317465',
        ciudad: 'Puebla',
        rol: 'Cliente',
      },
      {
        id: '1018',
        nombre: 'Abraham',
        apellido: 'García',
        correo: 'agcrm@gmail.com',
        telefono: '5579862413',
        ciudad: 'Puebla',
        rol: 'Cliente',
      },
    ];
    const resourceName = {
      singular: 'order',
      plural: 'orders',
    };

    const {selectedResources, allResourcesSelected, handleSelectionChange} =
      useIndexResourceState(orders);

    const rowMarkup = orders.map(
      (
        {id, nombre, apellido, correo, telefono, ciudad, rol},
        index,
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>{nombre}</IndexTable.Cell>
          <IndexTable.Cell>{apellido}</IndexTable.Cell>
          <IndexTable.Cell>{correo}</IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" numeric>
              {telefono}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{ciudad}</IndexTable.Cell>
          <IndexTable.Cell>{rol}</IndexTable.Cell>
        </IndexTable.Row>
      ),
    );


    return (
      <form className='container mt-6'>
        <div>        
          <LegacyCard>
            <IndexTable 
              resourceName={resourceName}
              itemCount={orders.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                {title: 'Nombre'},
                {title: 'Apellido'},
                {title: 'Correo electrónico'},
                {title: 'Teléfono'},
                {title: 'Ciudad'},
                {title: 'Rol'},
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
        </div>
      </form>
      
    );
  }
  return (
    <div>
      <span className="font-semibold text-[20px]"  >Clientes</span>
      <SimpleIndexTableExample/>
    </div>
  );
}
