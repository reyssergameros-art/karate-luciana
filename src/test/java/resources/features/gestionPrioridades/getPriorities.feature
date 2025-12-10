Feature: Listar todas las Prioridades


  Background: 
    * url 'http://localhost:8080'
    * def commonHeaders = { Accept: 'application/json', x-correlation-id: '550e8400-e29b-41d4-a716-446655440000', x-request-id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', x-transaction-id: '7c9e6679-7425-40de-944b-e07fc1f90ae7' }
    * def prioritySchema = read('classpath:resources/schemas/prioritySchema.json')

  Scenario: Listar Prioridades exitosamente
    Given path 'priorities'
    And headers commonHeaders
    When method get
    Then status 200
    And match response == '#array'
    And match each response == prioritySchema