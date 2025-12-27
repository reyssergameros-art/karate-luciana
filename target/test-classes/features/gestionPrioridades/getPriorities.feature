Feature: Listar todas las Prioridades


  Background: 
    * url baseUrl
    * path 'priorities'
    * headers headers
    * def prioritySchema = read('classpath:schemas/prioritySchema.json')

  @positive
  Scenario: Listar Prioridades exitosamente
    When method get
    Then status 200
    And match response == '#array'
    And match each response == prioritySchema
    

  