package karate.runner;

import com.intuit.karate.junit5.Karate;

/**
 * Test Runner for executing all Karate feature files.
 * 
 * This runner follows best practices:
 * - Single Responsibility Principle: Only responsible for test execution configuration
 * - Open/Closed Principle: Can be extended without modification for additional runners
 * - Uses JUnit5 integration for modern test execution
 * - Executes all features in the classpath
 * - Generates comprehensive test reports
 * 
 * @author Quality Team
 * @version 1.0
 */
public class TestRunner {
    
    /**
     * Executes all feature files found in the classpath.
     * 
     * This method configures the Karate test execution to:
     * - Run all .feature files in the project
     * - Generate HTML and JSON reports
     * - Use parallel execution capabilities (configurable via karateOptions)
     * 
     * @return Karate test configuration
     */
    @Karate.Test
    Karate testAll() {
        return Karate.run("classpath:resources/features").relativeTo(getClass());
    }
    
    /**
     * Executes a specific feature or set of features by path.
     * Example: Can be customized to run specific modules or folders.
     * 
     * Uncomment and modify as needed for targeted test execution.
     * 
     * @return Karate test configuration
     */
    /*
    @Karate.Test
    Karate testGestionPrioridades() {
        return Karate.run("classpath:resources/features/gestionPrioridades")
                     .relativeTo(getClass());
    }
    */
    
    /**
     * Executes tests in parallel for faster execution.
     * 
     * Parallel execution configuration:
     * - threads: Number of parallel threads (recommended: number of CPU cores)
     * - Improves execution time for large test suites
     * 
     * @return Karate test configuration
     */
    /*
    @Karate.Test
    Karate testParallel() {
        return Karate.run()
                     .relativeTo(getClass())
                     .parallel(5);
    }
    */
    
    /**
     * Executes tests filtered by tags.
     * 
     * Tag-based execution allows:
     * - Running smoke tests: @smoke
     * - Running regression tests: @regression
     * - Excluding work in progress: ~@wip
     * 
     * @return Karate test configuration
     */
    /*
    @Karate.Test
    Karate testByTags() {
        return Karate.run()
                     .tags("@smoke")
                     .relativeTo(getClass());
    }
    */
}
