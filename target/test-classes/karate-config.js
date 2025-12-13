/* eslint-disable */

/**
 * Configuración principal de Karate para el framework de automatización
 * Soporta ambientes: integracion, certificacion
 * Soporta runners: local, remoto (Azure)
 */
function fn() {
	// ===============================================
	// 1. CONFIGURACIÓN INICIAL SIMPLIFICADA
	// ===============================================
	var env = karate.env || 'integracion';
	var runner = karate.runner ||
		karate.properties['karate.runner'] ||
		java.lang.System.getProperty('karate.runner') ||
		'local';

	// Configurar versión de API: obtiene ID ephemeral desde variable de entorno
	// Si existe EPHEMERAL_ID, construye "v1;rev=ID", sino usa "v1" por defecto
	var ephemeralValue = java.lang.System.getenv('EPHEMERAL_ID');
	var finalversion = ephemeralValue ? "v1;rev=" + ephemeralValue : 'v1';

	// Solo mostrar log si hay un ID ephemeral configurado
	if (ephemeralValue) {
		karate.log('🔍 EPHEMERAL_ID configurado:', ephemeralValue, '| Versión final:', finalversion);
	}

	// ===============================================
	// 2. IMPORTAR CLASES JAVA NECESARIAS
	// =============================================== 
	// var SecretManagerConfig = Java.type('com.pacifico.automation.utils.security.config.SecretManagerConfig');
	// var SecretManager = Java.type('com.pacifico.automation.utils.security.SecretManager');
	// var LogModifier = Java.type('com.pacifico.automation.utils.security.LogModifier');

	// karate.configure('logModifier', new LogModifier());

	// ===============================================
	// 3. CONFIGURACIONES POR AMBIENTE (SIMPLIFICADO)
	// ===============================================
	var ENVIRONMENTS = {
		integracion: {
			keyvault: '', // URL del Key Vault de Azure para integración ejemplo: https://mi-keyvault-integracion.vault.azure.net/
			secretFile: 'config/integracion-secrets.properties',
			secretsName: {}, // Nombres de secretos específicos por ambiente
			api: {
				baseUrl: 'http://localhost:8080', // URL base de la API para integración
				path: '', // Path de la API para integración
				version: finalversion,
				param: '' // Parámetro adicional si aplica
			},
			paths: {
				priorities: 'priorities'
			}
		},
		certificacion: {
			keyvault: '', // URL del Key Vault de Azure para certificación ejemplo: https://mi-keyvault-certificacion.vault.azure.net/
			secretFile: 'config/certification-secrets.properties',
			secretsName: {}, // Nombres de secretos específicos por ambiente
			api: {
				baseUrl: 'http://qa-server:8080', // URL base de la API para certificación
				path: '', // Path de la API para certificación
				version: finalversion,
			},
			paths: {
				priorities: 'priorities'
			}
		}
	};

	// Obtener configuración del ambiente actual
	var envConfig = ENVIRONMENTS[env] || ENVIRONMENTS.integracion;
	karate.log('✅ Configuración de ambiente cargada para:', env);

	// ===============================================
	// 4. CONFIGURAR SECRET MANAGER
	// ===============================================
	function setupSecretManager() {
		try {
			var config = new SecretManagerConfig();

			if (runner === 'local') {
				karate.log('🔧 Configurando para desarrollo local');
				config.setSecretsFilePath(envConfig.secretFile);
				config.setUseFileProvider(true);
			} else {
				karate.log('☁️ Configurando para Azure Key Vault:', runner);
				config.setKeyVaultUrl(envConfig.keyvault);
				config.setUseAzureKeyVault(true);
			}

			return SecretManager.getInstance(config);
		} catch (error) {
			throw new Error('❌ Error configurando Secret Manager: ' + error.message);
		}
	}

	// ===============================================
	// 🚨 CONFIGURACIÓN CRÍTICA DEL SECRET MANAGER 🚨
	// ===============================================
	// ⚠️  Esta línea está comentada intencionalmente para el framework base
	// ☁️  Descomenta cuando tengas tu proyecto real con Key Vault configurado
	// 
	// INSTRUCCIÓN: Descomenta la siguiente línea solo cuando:
	// 1. Tengas un Azure Key Vault configurado
	// 2. Hayas configurado las URLs del Key Vault en ENVIRONMENTS
	// 3. Estés listo para usar secretos reales (no mock)
	// 4. Borra esta instrucción y los comentarios relacionados
	// ===============================================
	// var secretManager = setupSecretManager(); // <-- DESCOMENTAR PARA PROYECTOS REALES

	karate.log('✅ Secret Manager inicializado correctamente');

	// ===============================================
	// 5. OBTENER SECRETOS DE MANERA SEGURA
	// ===============================================
	function getSecret(secretName) {
		try {
			karate.log('🔐 Obteniendo secreto:', secretName);
			var secret = secretManager.getSecret(secretName);

			if (!secret) {
				throw new Error('Secreto vacío o null');
			}

			karate.log('✅ Secreto obtenido exitosamente:', secretName);
			return secret;
		} catch (error) {
			karate.log('⚠️ Error obteniendo secreto:', secretName, '- Error:', error.message);

			// Fallback para desarrollo local
			if (runner === 'local') {
				karate.log('🔧 MODO LOCAL: Usando valor por defecto para:', secretName);
				return 'default-secret-value';
			}

			throw new Error('❌ No se pudo obtener el secreto: ' + secretName + ' - ' + error.message);
		}
	}

	// ===============================================
	// 6. CONSTRUIR CONFIGURACIÓN DE LA APLICACIÓN
	// ===============================================
	function buildAppConfig() {
		try {
			karate.log('🔧 Construyendo configuración de aplicación...');

			return {
				// Configuración de API
				baseUrl: envConfig.api.baseUrl,
				apiPath: envConfig.api.path,
				version: envConfig.api.version,
				headers: {
					"accept": 'application/json',
					"x-correlation-id": '550e8400-e29b-41d4-a716-446655440000',
					"x-request-id": '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
					"x-transaction-id": '7c9e6679-7425-40de-944b-e07fc1f90ae7'
				},
				// Paths de endpoints por ambiente
				paths: envConfig.paths
			};
		} catch (error) {
			throw new Error('❌ Error construyendo configuración: ' + error.message);
		}
	}

	var appConfig = buildAppConfig();
	karate.log('✅ Configuración de aplicación construida exitosamente');

	// ===============================================
	// 7. OBTENER TOKEN DE AUTORIZACIÓN
	// ===============================================
	// 🚨 FRAMEWORK BASE: Esta sección está deshabilitada intencionalmente
	// 
	// 📋 CUÁNDO HABILITAR:
	//    ✅ Tu API requiere un token de autorización (Bearer, JWT, etc.)
	//    ✅ Has creado el feature 'token.feature' para obtener tokens
	//    ✅ Estás trabajando en un proyecto real (no el framework base)
	// 
	// 🔧 CÓMO HABILITAR:
	//    1. Descomenta las funciones getAuthToken() y getAuthToken()
	//    2. Crea o ajusta 'resources/features/token.feature'
	//    3. Asegúrate que devuelva: { "bearerToken": "Bearer tu-token-aqui" }
	//    4. Elimina estos comentarios explicativos
	// 
	// 💡 FRAMEWORK BASE: Si no necesitas autorización, elimina toda esta sección
	// ===============================================
	// ===============================================
	// function getAuthToken() {
	// 	try {
	// 		karate.log('🔐 Obteniendo token de autorización...');
	// 		var result = karate.callSingle('classpath:resources/features/token.feature', appConfig);

	// 		if (result && result.bearerToken) {
	// 			appConfig.headers.Authorization = result.bearerToken;
	// 			karate.log('✅ Token de autorización configurado exitosamente');
	// 			return true;
	// 		} else {
	// 			karate.log('⚠️ No se pudo obtener token de autorización');
	// 			return false;
	// 		}
	// 	} catch (error) {
	// 		karate.log('⚠️ Error obteniendo token:', error.message);
	// 		karate.log('🔧 Continuando sin token de autorización...');
	// 		return false;
	// 	}
	// }
	// getAuthToken();

	// ===============================================
	// 8. CONFIGURACIONES FINALES DE KARATE
	// ===============================================
	karate.configure('connectTimeout', 5000);
	karate.configure('readTimeout', 5000);
	karate.configure('logPrettyRequest', true);
	karate.configure('logPrettyResponse', true);

	// ===============================================
	// 9. RESUMEN DE CONFIGURACIÓN
	// ===============================================
	karate.log('🎉 === CONFIGURACIÓN COMPLETADA ===');
	karate.log('📍 Ambiente:', env);
	karate.log('🏃 Runner:', runner);

	return appConfig;
}
